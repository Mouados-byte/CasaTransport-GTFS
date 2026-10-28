import { RateLimitConfig, RateLimitedFetcher } from "@utils/RatelimitedFetcher.ts";
import Line, { ILineWithStopTimes } from "@tram-types/line.ts";
import type { GtfsExportBundle } from "@local-types/types.ts";
import { HolidaysSundaysCache } from "@local-types/holidays.ts";
import {
    GtfsData, StopPoint, CalendarPerimeter, DeparturesOptions,
    ComputedTime, Destination, DiscoveryResponse, LineNumber,
    TStopDepartures, GtfsProtoData, IScheduleStopTime,
    LineFrequency, RoutePlannerResponse, LineName
} from "@tram-types/types.ts";
import GTFSExporter from "./GTFSExporter.ts";
import {
    CASATRAMWAY_GTFS_URI, CASATRAMWAY_RATELIMIT_CONFIG,
    CASATRAMWAY_ROUTE_PLANNER_RATELIMIT_CONFIG,
    CASATRAMWAY_ROUTE_PLANNER_URI,
    CASATRAMWAY_SINGLE_FARE_MAD,
    CASATRAMWAY_TRANSFER_WINDOW_SECS,
    FEED_INFO
} from "./constants.ts";
import { TimeBasedValue } from "@utils/TimeRange.ts";

// @deno-types="@proto/orchestraProto.d.ts"
import { proto } from "@proto/orchestraProto.js";
import {
    ProtoClassConstructor, ProtoClasses,
    ProtoStopFromStopPoint
} from "@proto/types.ts";
import {
    dateToCasaTramwayDate,
    toGtfsDate, getHolidaysSundaysCache,
    getClosestSaturday, getClosestWeekday,
    getClosestSunday,
    minutesToTime,
    moveArrayElement, 
    normalizeStopName,
    getRoutePlannerSessionCookie,
    haversineDistance,
    interpolateStopOffsets,
    secondsToTime
} from "@utils/utils.ts";

import OSMFetcher from "@utils/OSMFetcher.ts";

export default class CasaTramwayGTFS extends GTFSExporter {
    private static gtfsHolidays: HolidaysSundaysCache;
    public routePlannerFetcher: RateLimitedFetcher;
    public osmFetcher = new OSMFetcher(this.constructor.name);

    constructor(
        ratelimitConfig: RateLimitConfig =
            CASATRAMWAY_RATELIMIT_CONFIG,
        routePlannerRatelimitConfig: RateLimitConfig =
            CASATRAMWAY_ROUTE_PLANNER_RATELIMIT_CONFIG,
        private readonly gtfsUri: string = CASATRAMWAY_GTFS_URI,
        private readonly routePlannerUri: string = CASATRAMWAY_ROUTE_PLANNER_URI
    ) {
        super(ratelimitConfig);
        this.routePlannerFetcher = new RateLimitedFetcher(routePlannerRatelimitConfig);
    }

    private makeApiUrl(pathAndQuery: string): string {
        const normalized = pathAndQuery.startsWith("/")
            ? pathAndQuery
            : `/${pathAndQuery}`;
        return `${this.gtfsUri}${normalized}`;
    }

    private async fetchJson<T>(
        pathAndQuery: string,
        ctor?: new (json: object) => T,
        reqParams?: RequestInit,
        useRoutePlannerURI?: boolean
    ): Promise<T> {
        const url = useRoutePlannerURI ? pathAndQuery : this.makeApiUrl(pathAndQuery);
        let response = await (useRoutePlannerURI ? this.routePlannerFetcher : this.fetcher)
            .fetchRaw(url, reqParams);
        let responseJson: object | false;

        // TODO: temp
        if (useRoutePlannerURI) {
            let retry = 0;
            while (!response.ok && retry < 6) {
                await new Promise(r => setTimeout(r, 1000 * (retry + 1)));
                response = await this.routePlannerFetcher.fetchRaw(url, reqParams);
                retry++;
            }
        }

        // all /phtv/get endpoints return 200 with body "false" if the request is invalid
        if (!response.ok || (responseJson = await response.json()) === false) {
            throw new Error(
               `Failed to fetch ${pathAndQuery} (${response.status} ${response.statusText}) from ${url}`
            );
        }

        return ctor ? new ctor(responseJson) : responseJson as T;
    }

    private async fetchProto<T extends ProtoClassConstructor<ProtoClasses>>(
        pathAndQuery: string,
        proto: T
    ): Promise<InstanceType<T>> {
        const url = this.makeApiUrl(pathAndQuery);
        const response = await this.fetcher.fetchRaw(url);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch ${pathAndQuery} (${response.status} ${response.statusText}) from ${url}`
            );
        }
        const buffer = await response.arrayBuffer();
        return proto.decode(new Uint8Array(buffer)) as InstanceType<T>;
    }

    private async ensureHolidaysCache() {
        if (!CasaTramwayGTFS.gtfsHolidays) {
            const holidays = await getHolidaysSundaysCache();

            CasaTramwayGTFS.gtfsHolidays = holidays;
        }
    }

    private unwrapItems<T>(payload: DiscoveryResponse<T>, ctor?: new (obj: object) => T): T[] {
        if (!payload || !payload?.items) {
            return [];
        }
        if (Array.isArray(payload.items)) {
            return payload.items.map((item) => (ctor ? new ctor(item as object) : item));
        }
        return Object.values(payload.items) as T[];
    }

    private formatRoutePlannerID(
        line: Line,
        stop: StopPoint<true | false>,
        allStops: { [key: string]: StopPoint<true | false> }
    ): string {
        const stopID = parseInt(stop.StopPointRef);

        if (line.lineRef.startsWith("T")) {
            return `STOPAREA|CASATRAMWAY:${stopID}`;
        }

        // bus stop terminals have 2 identical StopPoints with different StopPointRefs
        // for some reason
        const otherStopID = Object.values(allStops).find(s =>
            Object.keys(s.Lines).includes(line.lineRef) &&
            s.StopStreet === stop.StopStreet &&
            s.StopStreetNumber === stop.StopStreetNumber &&
            s.StopPointRef !== stop.StopPointRef
        )!.StopPointRef;

        return stop.StopName.value.endsWith("Terminus")
            ? `STOPAREA|ISSTOPPLACE:CASATRAMWAY:${stopID}:CASATRAMWAY:${otherStopID}`
            : `STOPAREA|CASATRAMWAY:${stopID}`;
    }


    // Equivalent of initDataProto.ts (JSON discovery endpoint)
    async getInitData(
        _area?: string,
        onlyPhysicals?: boolean,
        network: string = ""
    ): Promise<GtfsData> {
        const linesPath = `/lines-discovery?reseau=${network}&max=1000`;
        let stopsPath = `/stoppoints-discovery?reseau=${network}&max=10000`;
        if (onlyPhysicals) {
            stopsPath += "&onlyphysicals=1";
        }

        const [linesResponse, stopsResponse] = await Promise.all([
            this.fetchJson<DiscoveryResponse<Line>>(linesPath),
            this.fetchJson<DiscoveryResponse<StopPoint<false>>>(stopsPath)
        ]);

        const linesRaw = this.unwrapItems(linesResponse, Line);
        const stopsRaw = this.unwrapItems(stopsResponse);

        const lines = Object.fromEntries(
            linesRaw.map(line => [line.lineRef, line])
        ) as GtfsData["lines"];

        const stops: GtfsData["stops"] = Object.fromEntries(
            stopsRaw.map(stop => [stop.StopPointRef, stop])
        );
        // for (const rawStop of stopsRaw) {
        //     const ref = rawStop.StopPointRef;
        //     if (!ref) {
        //         continue;
        //     }

        //     const location = rawStop.Location;
        //     const stop: WebpackStopPoint = {
        //         name: rawStop.StopName.value,
        //         x: this.numberFrom(location.Latitude) ?? 0,
        //         y: this.numberFrom(location.Longitude) ?? 0,
        //         ref,
        //         city: rawStop.StopCity,
        //         lines: [],
        //         dests: [],
        //         isCommercial: false,
        //         spoints: [],
        //     };

        //     const stopLines = rawStop.Lines;
        //     for (const lineRaw of Object.values(stopLines)) {
        //         const service = lineRaw.LineRef;
        //         if (!service) {
        //             continue;
        //         }
        //         stop.lines!.push(service);
        //         const dests = lineRaw.Dests;
        //         for (const destRaw of dests) {
        //             stop.dests!.push({
        //                 id: `${service}_${ref}_${destRaw.direction}`,
        //                 name: destRaw.lib,
        //                 service,
        //             });
        //         }
        //     }

        //     stops[ref] = StopPointFromWebpack<false>(stop);
        // }

        return { lines, stops };
    }

    // Equivalent of initDataProto.ts (protobuf discovery endpoints)
    async getInitDataProto(
        _area?: string,
        onlyPhysicals?: boolean,
        network: string = ""
    ): Promise<GtfsProtoData> {
        const linesPath = `/proto/lines-discovery-all?reseau=${network}`
        let stopsPath = `/proto/stoppoints-discovery-all?reseau=${network}`;
        if (onlyPhysicals) {
            stopsPath += "&onlyphysicals=1";
        }

        const [linesResponse, stopsResponse] = await Promise.all([
            this.fetchProto(linesPath, proto.LinesApiResponse),
            this.fetchProto(stopsPath, proto.StopsApiResponse)
        ]);

        const lines = Object.fromEntries(
            linesResponse.lines.map(line => [line.ref as LineName, new proto.Line(line)])
        ) as GtfsProtoData["lines"];

        const stops: GtfsProtoData["stops"] = Object.fromEntries(
            stopsResponse.stops.map(stop => [stop.ref, new proto.Stop(stop)])
        );

        return { lines, stops };
    }

    // Equivalent of getLineStops.ts
    async getLineStops(
        line: string,
        direction: 0 | 1 | "" = "",
        onlyPhysicals?: boolean,
        network: string = ""
    ): Promise<StopPoint<true>[]> {
        let path = `/stops-line-discovery?max=1000&reseau=${network}&line=${line}&direction=${direction}`;
        if (onlyPhysicals !== undefined) {
            path += `&onlyphysicals=${onlyPhysicals ? 1 : 0}`;
        }

        const payload = await this.fetchJson<DiscoveryResponse<StopPoint<true>>>(path);
        if (!payload || !payload.items) {
            return [];
        }

        return this.unwrapItems(payload);
    }

    // Equivalent of getCalendarPerimeter.ts
    async getCalendarPerimeter(network: string = ""): Promise<CalendarPerimeter> {
        const payload = await this.fetchJson<CalendarPerimeter>(`/calendar-perimeter?reseau=${network}`);

        if (!payload) {
            throw new Error(
                `calendar-perimeter returned no data for network "${network}"`
            );
        }

        return payload;
    }

    // Equivalent of internal getLineInfos(...) in departuresFromGtfs.ts
    async getLine(lineId: LineName, network: string = ""): Promise<Line> {
        const payload = await this.fetchJson(`/line?reseau=${network}&line=${lineId}`, Line);

        return payload;
    }

    // Equivalent of getComputedTimes.ts
    getComputedTimes(schedules: IScheduleStopTime[]): ComputedTime[] {
        const now = new Date();
        const computed: ComputedTime[] = [];

        for (const schedule of schedules) {
            const depTime = schedule.DepTime;
            const liveTime = schedule.realTime?.time;
            let date: Date | null = null;
            let isLive = false;

            if (liveTime) {
                const [h, m] = String(liveTime).split(":");
                const current = new Date();
                current.setHours(Number(h), Number(m), 0, 0);
                date = current;
                isLive = true;
            } else {
                const parts = depTime.match(/(\d+)/g);
                if (parts && parts.length >= 5) {
                    date = new Date(
                        Number(parts[2]),
                        Number(parts[1]) - 1,
                        Number(parts[0]),
                        Number(parts[3]),
                        Number(parts[4]),
                        0,
                        0
                    );
                }
            }

            if (!date) {
                continue;
            }

            const minutes = Math.floor(
                (date.getTime() - now.getTime()) / (1000 * 60),
            );
            const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

            computed.push({
                date,
                minutes,
                time,
                isLive,
                isCanceled: /* schedule.canceled */ false,
                tripHeadsign: schedule.tripHeadsign,
                journeyId: schedule.journeyId
            });
        }

        return computed;
    }

    // Equivalent of gtfsStopDepartures(...) in departuresFromGtfs.ts
    async getStopDepartures(
        stop: StopPoint<true | false> | proto.Stop | string,
        network: string = "",
        options: DeparturesOptions = {}
    ): Promise<TStopDepartures> {
        const limit = options.limit ?? 2;
        const ref = stop instanceof proto.Stop
            ? stop.ref
            : typeof stop === "string"
                ?  stop :
                stop.StopPointRef;
        let path = `/stop-stoptimes-discovery?nbtimes=${limit}&stop=${ref}&reseau=${network}`;

        if (options.date) {
            path += `&date=${options.date}`;
        }
        if (options.time) {
            path += `&heure=${options.time}`;
        }
        if (options.nbpasttimes !== undefined) {
            const pastsince = options.pastsince ?? 480;
            path += `&nbpasttimes=${options.nbpasttimes}&pastsince=${pastsince}`;
        }

        const payload = await this.fetchJson<
            DiscoveryResponse<ILineWithStopTimes, `${LineNumber}_${'0' | '1'}`>
        >(path);
        if (!payload || !payload.items) {
            return {};
        }

        return payload.items as TStopDepartures;
    }

    // Equivalent of departuresFromGtfs.ts main export
    // TODO: implement fully
    async getDeparturesFromGtfs(
        stopsPoints: proto.Stop[],
        lines: { [key in LineName]?: Line },
        network: string = "",
        options: DeparturesOptions = {}
    ): Promise<Destination[]> {
        const expandedStops: proto.Stop[] = [];
        for (const stop of stopsPoints) {
            if (stop.spoints && stop.spoints.length > 0) {
                expandedStops.push(...(stop.spoints.map(ProtoStopFromStopPoint)));
            } else {
                expandedStops.push(stop);
            }
        }

        const departuresByStop = await Promise.all(
            expandedStops.map((stop) =>
                this.getStopDepartures(stop, network, options)
            )
        );

        const allDestinations: Destination[] = [];
        for (const schedules of departuresByStop) {
            for (const [_, schedule] of Object.entries(schedules)) {
                const serviceId = schedule.RouteId;
                const line = lines[serviceId];
                if (!line) {
                    continue;
                }
                allDestinations.push({
                    mnemoService: schedule.ShortName,
                    serviceId,
                    line,
                    direction: schedule.Direction,
                    dirlib: schedule.DirLib,
                    fromlib: "",
                    times: this.getComputedTimes(schedule.Schedule)
                });
            }
        }

        const merged: { [key: string]: Destination } = {};
        for (const destination of allDestinations) {
            const key = `${destination.serviceId}::${destination.dirlib ?? ""}`;
            if (!merged[key]) {
                merged[key] = destination;
                continue;
            }
            merged[key].times.push(...destination.times);
        }

        return Object.values(merged).sort(
            (a, b) => (a.line.order ?? 0) - (b.line.order ?? 0)
        );
    }

    async getOrderedStops(
        line: LineName,
        direction: 0 | 1,
        onlyPhysicals?: boolean,
        network: string = ""
    ): Promise<StopPoint<true>[]> {
        return (await this.getOrderedStopsAndDuration(line, direction, onlyPhysicals, network)).stops;
    }

    /**
     * Ordered stops of a line direction, plus the terminal-to-terminal travel time in seconds
     * that the Casatramway route planner reports for the first morning departure.
     */
    async getOrderedStopsAndDuration(
        line: LineName,
        direction: 0 | 1,
        onlyPhysicals?: boolean,
        network: string = ""
    ): Promise<{ stops: StopPoint<true>[], durationSecs: number }> {
        const { lines, stops: allStops } = await this.getInitData(undefined, onlyPhysicals, network);
        const lineStops = await this.getLineStops(line, direction, onlyPhysicals, network);

        const lineInfo = lines[line];

        // busway terminals have Arrivée suffix for some god forsaken reason
        // and Oulmes busway terminal has lowercase t in "Terminus" for some other fucking reason
        const firstTerminalName = lineInfo!.destinations.find(
            dest => dest.destinationDir !== direction
        )!.destinationRef.replace("terminus", "Terminus").replace(" Arrivée", "");
        const lastTerminalName = lineInfo!.destinations.find(
            dest => dest.destinationDir === direction
        )!.destinationRef.replace("terminus", "Terminus").replace(" Arrivée", "");

        const firstTerminalStop = lineStops.find(s => s.StopName.value === firstTerminalName)!;
        const lastTerminalStop = lineStops.find(s => s.StopName.value === lastTerminalName)!;

        // 05:00 AM is the earliest departure time for all lines
        let departureTime: string;
        {
            const now = new Date();
            const targetDate = new Date(Date.UTC(
                now.getUTCFullYear(),
                now.getUTCMonth(),
                now.getUTCDate(),
                5, 0, 0, 0
            ));

            departureTime = targetDate.toISOString().replace('Z', "+00:00");
        }

        const route = await this.fetchJson<RoutePlannerResponse>(this.routePlannerUri, undefined, {
            method: "POST",
            body: new URLSearchParams({
                estimatedResults: "true",
                "from[id]": this.formatRoutePlannerID(lineInfo, firstTerminalStop, allStops),
                "from[value]": firstTerminalName,
                "from[latitude]": firstTerminalStop.Location.Latitude,
                "from[longitude]": firstTerminalStop.Location.Longitude,
                "to[id]": this.formatRoutePlannerID(lineInfo, lastTerminalStop, allStops),
                "to[value]": lastTerminalName,
                "to[latitude]": lastTerminalStop.Location.Latitude,
                "to[longitude]": lastTerminalStop.Location.Longitude,
                departureDateTime: departureTime,
                arrivalDateTime: "",
                "modes[]": line.startsWith("T") ? "TRAM" : "BUS",
                "walk[speed]": "1",
                "bike[speed]": "1",
                displayFacilities: "true",
                scholarLines: "EXCLUDE",
                accessible: "false",
                avoidDisruptions: "false",
                criterion: "FASTEST",
                currentUrl: "https://www.casatramway.ma/se-deplacer/calcul-ditineraire",
                widgetContext: "false",
                layoutMode: "TRANSPORT"
            }),
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0",
                "Accept": "text/html, */*; q=0.01",
                "Accept-Language": "en-US,en;q=0.9",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                Cookie: `PHPSESSID=${(await getRoutePlannerSessionCookie()).cookie}`
            },
            referrer: "https://www.casatramway.ma/"
        }, true);
        const routeLeg = route.response.tripPlanner.TRANSPORT
            .groups[0].results.journeys[0].paths.filter(leg => leg.mode !== "WALK")[0];
        const routeStopPoints = routeLeg.stoppoints;

        const sortedStops = lineStops.sort((a, b) => {
            const aIdx = routeStopPoints.findIndex(sp => sp.id.split(':')[1] === a.StopPointRef);
            const bIdx = routeStopPoints.findIndex(sp => sp.id.split(':')[1] === b.StopPointRef);

            // terminals arent included in route planner legs
            if (aIdx === -1 || bIdx === -1)
                return -1;

            return aIdx - bIdx;
        });
        moveArrayElement(
            sortedStops, 
            sortedStops.findIndex(s => s.StopPointRef === firstTerminalStop.StopPointRef),
            0
        );
        moveArrayElement(
            sortedStops, 
            sortedStops.findIndex(s => s.StopPointRef === lastTerminalStop.StopPointRef),
            -1
        );

        return { stops: sortedStops, durationSecs: routeLeg.duration };
    }


    lineFrequencyFromStopTimes(
        weekdays: IScheduleStopTime[],
        saturdays: IScheduleStopTime[],
        holidays: IScheduleStopTime[]
    ): LineFrequency {
        const parseDepartureMinutes = (schedule: IScheduleStopTime): number | null => {
            const parts = schedule.DepTime.match(/(\d+)/g);
            if (!parts || parts.length < 5) {
                return null;
            }

            const hours = Number(parts[3]);
            const mins = Number(parts[4]);
            if (!Number.isFinite(hours) || !Number.isFinite(mins)) {
                return null;
            }

            return hours * 60 + mins;
        };

        const normalizeHeadway = (diffs: number[]): number => {
            const avg = diffs.reduce((sum, value) => sum + value, 0) / diffs.length;
            return Math.round(avg * 2) / 2;
        };

        const shouldMerge = (currentDiff: number, nextDiff: number): boolean => {
            if (currentDiff === nextDiff) {
                return true;
            }

            const isFiveOrSix = (value: number) => value === 5 || value === 6;
            return isFiveOrSix(currentDiff) && isFiveOrSix(nextDiff);
        };

        const buildFrequency = (schedules: IScheduleStopTime[]): TimeBasedValue<number> => {
            const minutes = schedules
                .map(parseDepartureMinutes)
                .filter((value): value is number => value !== null)
                .sort((a, b) => a - b);

            const uniqueMinutes: number[] = [];
            for (const value of minutes) {
                if (uniqueMinutes[uniqueMinutes.length - 1] !== value) {
                    uniqueMinutes.push(value);
                }
            }

            if (uniqueMinutes.length < 2) {
                return new TimeBasedValue([]);
            }

            const ranges: [string, string, number][] = [];
            let rangeStart = uniqueMinutes[0];
            let currentDiff: number | null = null;
            let diffGroup: number[] = [];
            let previous = uniqueMinutes[0];

            for (let i = 1; i < uniqueMinutes.length; i++) {
                const current = uniqueMinutes[i];
                const diff = current - previous;
                if (diff <= 0) {
                    previous = current;
                    continue;
                }

                if (currentDiff === null) {
                    currentDiff = diff;
                    diffGroup = [diff];
                    previous = current;
                    continue;
                }

                if (shouldMerge(currentDiff, diff)) {
                    diffGroup.push(diff);
                    previous = current;
                    continue;
                }

                ranges.push([
                    minutesToTime(rangeStart),
                    minutesToTime(previous),
                    normalizeHeadway(diffGroup)
                ]);

                rangeStart = previous;
                currentDiff = diff;
                diffGroup = [diff];
                previous = current;
            }

            if (diffGroup.length > 0) {
                ranges.push([
                    minutesToTime(rangeStart),
                    minutesToTime(previous),
                    normalizeHeadway(diffGroup)
                ]);
            }

            return new TimeBasedValue(ranges);
        };

        return {
            weekday: buildFrequency(weekdays),
            saturday: buildFrequency(saturdays),
            sunday_holiday: buildFrequency(holidays)
        };
    }


    // GTFS data methods

    async getGTFSAgency(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);
        const agencies = new Map<number, string>();

        for (const line of Object.values(lines)) {
            const agencyId = line.agencyRef;
            const agencyName = line.agencyName;
            if (!agencies.has(agencyId)) {
                agencies.set(agencyId, agencyName);
            }
        }

        return this.toCsv(
            [
                "agency_id",
                "agency_name",
                "agency_url",
                "agency_timezone",
                "agency_lang"
            ] as const,
            Array.from(agencies.entries()).map(([id, agency]) => [
                id,
                agency,
                "https://www.casatramway.ma",
                "Africa/Casablanca",
                "fr"
            ])
        );
    }

    async getGTFSRoutes(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);

        return this.toCsv(
            [
                "route_id",
                "agency_id",
                "route_short_name",
                "route_long_name",
                "route_type",
                "route_color",
                "route_text_color"
            ] as const,
            Object.values(lines).map((line) => [
                line.lineRef,
                line.agencyRef,
                line.shortName,
                line.longName,
                line.type,
                line.color,
                line.colorText
            ])
        );
    }

    async getGTFSStops(network: string = ""): Promise<string> {
        const { stops } = await this.getInitData(undefined, undefined, network);

        return this.toCsv(
            [
                "stop_id",
                "stop_code",
                "stop_name",
                "stop_desc",
                "stop_lat",
                "stop_lon",
                "zone_id",
                "stop_url",
                "location_type",
                "parent_station",
                "stop_timezone",
                "wheelchair_boarding"
            ] as const,
            Object.values(stops).map((stop) => [
                stop.StopPointRef,
                stop.StopPointRef,
                normalizeStopName(stop.StopName.value),
                "",
                stop.Location.Latitude,
                stop.Location.Longitude,
                "",
                "",
                "",
                "",
                "",
                stop.wheelchair_boarding ?? 0
            ])
        );
    }

    async getGTFSShapes(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);
        const terminalsByLine = Object.entries(lines)
            .reduce((acc, [ref, line]) => ({
                ...acc,
                [ref as LineName]: line.destinations.reduce((acc, d) => ({
                    ...acc,
                    [`dir${d.destinationDir}Terminal`]: d.destinationRef
                }), {})
            }), {} as { [key in LineName]: { dir0Terminal: string, dir1Terminal: string } });

        const osmShapes = await this.osmFetcher.fetchAndCache(`
            [out:json][timeout:100];
            (
                relation["network"="Casa Tramway"]["route"="tram"];
                relation["network"="CasaBusway"];
            );
            (._; way(r); node(w););
            out body;
        `);
        const shapes = this.osmFetcher.parseShapes(osmShapes, terminalsByLine);

        const rows: [string, string, string, number, number][] = [];

        for (const [lineRef, points] of shapes) {
            let cumulativeDist = 0;
            for (let i = 0; i < points.length; i++) {
                const [lat, lon] = points[i];
                if (i > 0) {
                    const [prevLat, prevLon] = points[i-1];
                    cumulativeDist += haversineDistance(prevLat, prevLon, lat, lon);
                }
                rows.push([
                    `shape_${lineRef}`,
                    lat.toFixed(6), lon.toFixed(6),
                    i,
                    Math.round(cumulativeDist)
                ]);
            }
        }

        return this.toCsv(
            [
                "shape_id",
                "shape_pt_lat",
                "shape_pt_lon",
                "shape_pt_sequence",
                "shape_dist_traveled"
            ] as const,
            rows
        );
    }

    override async getGTFSFrequencies(network: string = ""): Promise<string> {
        await this.ensureHolidaysCache();
        const allHolidays = [
            ...CasaTramwayGTFS.gtfsHolidays.holidays,
            ...CasaTramwayGTFS.gtfsHolidays.sundays
        ] as const;

        const { lines, stops } = await this.getInitData(undefined, undefined, network);
        const rows: [string, string, string, number][] = [];

        const lineFreqToRows = (trip: string, freq: TimeBasedValue<number>): [string, string, string, number][] =>
            freq.toGtfsFrequency().map(([start_time, end_time, headway_min]) => [
                trip,
                start_time,
                end_time,
                headway_min * 60
            ]);

        for (const line of Object.values(lines)) {
            const lineStops = Object.values(stops).filter(s => Object.keys(s.Lines).includes(line.lineRef))!;
            const lineTerminals = lineStops.filter(s => s.StopName.value.indexOf("Terminus") !== -1);

            const firstTerminalDest = lineStops[0].Lines[line.lineRef]!.Dests.find(d => d.direction === 0)!;
            const lastTerminalDest = lineStops[0].Lines[line.lineRef]!.Dests.find(d => d.direction !== 0)!;
            const firstTerminalRef = lineTerminals.find(t => t.StopName.value === firstTerminalDest.lib)!;
            const lastTerminalRef = lineTerminals.find(t => t.StopName.value === lastTerminalDest.lib)!;

            for (const { destinationRef: _, destinationDir: dir } of line.destinations) {
                const key = `${line.lineRef}_${dir}` as const;
                const terminalRef = dir === 0 ? firstTerminalRef : lastTerminalRef;

                const stopTimesWeekdays = await this.getStopDepartures(terminalRef, network, {
                    limit: 200,
                    time: "05:00:00",
                    date: dateToCasaTramwayDate(getClosestWeekday(undefined, allHolidays))
                });
                const stopTimesSaturdays = await this.getStopDepartures(terminalRef, network, {
                    limit: 200,
                    time: "05:00:00",
                    date: dateToCasaTramwayDate(getClosestSaturday(undefined, allHolidays))
                });
                const stopTimesSundaysHolidays = await this.getStopDepartures(terminalRef, network, {
                    limit: 200,
                    time: "05:00:00",
                    date: dateToCasaTramwayDate(getClosestSunday())
                });

                const lineSchedule = this.lineFrequencyFromStopTimes(
                    stopTimesWeekdays[key]!.Schedule,
                    stopTimesSaturdays[key]!.Schedule,
                    stopTimesSundaysHolidays[key]!.Schedule
                );

                rows.push(
                    ...lineFreqToRows(`${line.lineRef}_${dir}_WEEKDAY`, lineSchedule.weekday)
                );
                rows.push(
                    ...lineFreqToRows(`${line.lineRef}_${dir}_SATURDAY`, lineSchedule.saturday)
                );
                rows.push(
                    ...lineFreqToRows(`${line.lineRef}_${dir}_SUNDAY_HOLIDAY`, lineSchedule.sunday_holiday)
                );
            }
        }

        return this.toCsv(
            ["trip_id", "start_time", "end_time", "headway_secs"] as const,
            rows
        );
    }

    async getGTFSTrips(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);

        const lineDestToRow = (line: Line, trip: string): [
            string, string, string, string, string, number, string, string, number, number
        ][] =>
            line.destinations.map(dest => [
                line.lineRef,
                `SVC_${trip}`,
                `${line.lineRef}_${dest.destinationDir}_${trip}`,
                dest.destinationRef,
                "",
                dest.destinationDir,
                "",
                `shape_${line.lineRef}_${dest.destinationDir}`,
                line.wheelchairAccessible ? 1 : 0,
                0
            ]);

        return this.toCsv(
            [
                "route_id",
                "service_id",
                "trip_id",
                "trip_headsign",
                "trip_short_name",
                "direction_id",
                "block_id",
                "shape_id",
                "wheelchair_accessible",
                "bikes_allowed"
            ] as const,
            Object.values(lines).flatMap(line => [
                ...lineDestToRow(line, "WEEKDAY"),
                ...lineDestToRow(line, "SATURDAY"),
                ...lineDestToRow(line, "SUNDAY_HOLIDAY"),
            ])
        );
    }

    async getGTFSStopTimes(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);
        const rows: [
            /* trip_id: */ string,
            /* arrival_time: */ string,
            /* departure_time: */ string,
            /* stop_id: */ string,
            /* stop_sequence: */ number,
            /* pickup_type: */ number,
            /* drop_off_type: */ number,
            /* timepoint: */ number
        ][] = [];

        // trips are frequency based, so stop times only carry offsets from the first departure
        const BASE_SECONDS = 5 * 60 * 60;

        for (const line of Object.values(lines)) {
            for (const dest of line.destinations) {
                // NOTE: could fetch stops once and reverse for other direction
                // but maybe in the future lines could have different stops per direction
                const direction = dest.destinationDir;
                const { stops, durationSecs } = await this.getOrderedStopsAndDuration(
                    line.lineRef, direction, undefined, network
                );
                if (!stops.length) continue;

                // the route planner only gives the terminal-to-terminal time, so intermediate
                // stops are interpolated by distance and marked as approximate (timepoint 0)
                const offsets = interpolateStopOffsets(
                    stops.map(s => [Number(s.Location.Latitude), Number(s.Location.Longitude)]),
                    durationSecs
                );

                const serviceSuffixes = ["WEEKDAY", "SATURDAY", "SUNDAY_HOLIDAY"] as const;
                for (const suffix of serviceSuffixes) {
                    const tripId = `${line.lineRef}_${direction}_${suffix}` as const;

                    for (let i = 0; i < stops.length; i++) {
                        const time = secondsToTime(BASE_SECONDS + offsets[i]);
                        rows.push([
                            tripId,
                            time,
                            time,
                            stops[i].StopPointRef,
                            i + 1,
                            0,
                            0,
                            i === 0 || i === stops.length - 1 ? 1 : 0
                        ]);
                    }
                }
            }
        }

        return this.toCsv(
            [
                "trip_id",
                "arrival_time",
                "departure_time",
                "stop_id",
                "stop_sequence",
                "pickup_type",
                "drop_off_type",
                "timepoint"
            ] as const,
            rows
        );
    }

    async getGTFSCalendar(network: string = ""): Promise<string> {
        const perimeter = await this.getCalendarPerimeter(network);
        const start = toGtfsDate(perimeter.start);
        const end = toGtfsDate(perimeter.end);

        return this.toCsv(
            [
                "service_id",
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
                "start_date",
                "end_date",
            ] as const,
            [
                ["SVC_WEEKDAY", 1, 1, 1, 1, 1, 0, 0, start, end],
                ["SVC_SATURDAY", 0, 0, 0, 0, 0, 1, 0, start, end],
                ["SVC_SUNDAY_HOLIDAY", 0, 0, 0, 0, 0, 0, 1, start, end]
            ]
        );
    }

    override async getGTFSCalendarDates(_network: string = ""): Promise<string> {
        await this.ensureHolidaysCache();

        return this.toCsv(
            ["service_id", "date", "exception_type"] as const,
            [
                ...CasaTramwayGTFS.gtfsHolidays.holidays,
                ...CasaTramwayGTFS.gtfsHolidays.sundays
            ].flatMap(date => [
                ["SVC_WEEKDAY", date, 2],
                ["SVC_SATURDAY", date, 2],
                ["SVC_SUNDAY_HOLIDAY", date, 1]
            ])
        );
    }

    // GTFS fares v1 ties a fare to one agency, so tram and busway each get the same single fare
    async getGTFSFareAttributes(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);
        const agencies = new Set(Object.values(lines).map(line => line.agencyRef));

        return this.toCsv(
            [
                "fare_id",
                "price",
                "currency_type",
                "payment_method",
                "transfers",
                "agency_id",
                "transfer_duration"
            ] as const,
            Array.from(agencies).map(agencyId => [
                `SINGLE_${agencyId}`,
                CASATRAMWAY_SINGLE_FARE_MAD.toFixed(2),
                "MAD",
                1,
                "",
                agencyId,
                CASATRAMWAY_TRANSFER_WINDOW_SECS
            ])
        );
    }

    async getGTFSFareRules(network: string = ""): Promise<string> {
        const { lines } = await this.getInitData(undefined, undefined, network);

        return this.toCsv(
            ["fare_id", "route_id"] as const,
            Object.values(lines).map(line => [`SINGLE_${line.agencyRef}`, line.lineRef])
        );
    }

    async getGTFSFeedInfo(network: string = ""): Promise<string> {
        const perimeter = await this.getCalendarPerimeter(network);
        const start = toGtfsDate(perimeter.start);
        const end = toGtfsDate(perimeter.end);

        return this.toCsv(
            [
                "feed_publisher_name",
                "feed_publisher_url",
                "feed_lang",
                "feed_start_date",
                "feed_end_date",
                "feed_version",
                "feed_contact_email",
                "feed_contact_url"
            ] as const,
            [[
                FEED_INFO.publisherName,
                FEED_INFO.publisherUrl,
                FEED_INFO.lang,
                start,
                end,
                FEED_INFO.version,
                FEED_INFO.contactEmail,
                FEED_INFO.contactUrl
            ]]
        );
    }

    async getAllGTFS(network: string = ""): Promise<GtfsExportBundle> {
        const [
            agency, routes, frequencies, trips,
            shapes, stopTimes, stops, calendar,
            calendarDates, feedInfo,
            fareAttributes, fareRules
        ] = await Promise.all([
            this.exportLogWrapper("agency.txt", this.getGTFSAgency, network),
            this.exportLogWrapper("routes.txt", this.getGTFSRoutes, network),
            this.exportLogWrapper("frequencies.txt", this.getGTFSFrequencies, network),
            this.exportLogWrapper("trips.txt", this.getGTFSTrips, network),
            this.exportLogWrapper("shapes.txt", this.getGTFSShapes, network),
            this.exportLogWrapper("stop_times.txt", this.getGTFSStopTimes, network),
            this.exportLogWrapper("stops.txt", this.getGTFSStops, network),
            this.exportLogWrapper("calendar.txt", this.getGTFSCalendar, network),
            this.exportLogWrapper("calendar_dates.txt", this.getGTFSCalendarDates, network),
            this.exportLogWrapper("feed_info.txt", this.getGTFSFeedInfo, network),
            this.exportLogWrapper("fare_attributes.txt", this.getGTFSFareAttributes, network),
            this.exportLogWrapper("fare_rules.txt", this.getGTFSFareRules, network)
        ]);

        return {
            "agency.txt": agency,
            "routes.txt": routes,
            "frequencies.txt": frequencies,
            "trips.txt": trips,
            "shapes.txt": shapes,
            "stop_times.txt": stopTimes,
            "stops.txt": stops,
            "calendar.txt": calendar,
            "calendar_dates.txt": calendarDates,
            "feed_info.txt": feedInfo,
            "fare_attributes.txt": fareAttributes,
            "fare_rules.txt": fareRules
        };
    }
}
