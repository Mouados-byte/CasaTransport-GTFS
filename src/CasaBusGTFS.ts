import { GtfsDate, GtfsExportBundle, TransportType } from "@local-types/types.ts";
import { RateLimitConfig, RateLimitedFetcher } from "@utils/RatelimitedFetcher.ts";
import {
    CASABUS_GTFS_RATELIMIT_CONFIG, CASABUS_API_RATELIMIT_CONFIG,
    FEED_INFO
} from "./constants.ts";
import GTFSExporter from "./GTFSExporter.ts";
import SimpleXMLParser from "@utils/SimpleXMLParser.ts";
import {
    APIType, APITypeName,
    CasaBusAPIResult,
    CasaBusGTFSShapesResponse, CasaBusGTFSStopsResponse,
    CasaBusGTFSShapeResponse,
    CasaBusLine,
    RouteID, RouteName, RouteNumber,
    RouteDetail, RouteHeader, RouteTimetableCalendar,
    RoutePolylineResponse, RoutePolyline, FullRouteDetail,
    CasaBusIncidentsResponse,
    TimetableEntry
} from "@bus-types/types.ts";
import {
    dateToGtfsDate,
    deduplicateByDeepEquality,
    deduplicateByKey,
    getClosestSaturday, getClosestSunday, getClosestWeekday
} from "@utils/utils.ts";
import { fixCBStopName } from "@utils/CBStopNameFix.ts";
import { Cache } from "@utils/CacheDecorator.ts";

export default class CasaBusGTFS extends GTFSExporter {
    public gtfsFetcher: RateLimitedFetcher;

    constructor(
        ratelimitConfig: RateLimitConfig = CASABUS_API_RATELIMIT_CONFIG,
        private readonly gtfsUri: string = APIType.GTFS,
        private readonly apiUrl: string = APIType.API,
        private readonly umbracoUri: string = APIType.UMBRACO
    ) {
        super(ratelimitConfig);
        this.gtfsFetcher = new RateLimitedFetcher(CASABUS_GTFS_RATELIMIT_CONFIG);
    }

    private getApiUrl(type: APITypeName): string {
        switch (type) {
            case "API": return this.apiUrl;
            case "GTFS": return this.gtfsUri;
            case "UMBRACO": return this.umbracoUri;
            default: throw new Error(`Unknown API type: ${type}`);
        }
    }

    private makeApiUrl(base: string, endpoint: string): string {
        return `${base.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
    }

    private async fetchJSON<T>(
        endpoint: string,
        body: object = {},
        ctor?: new (json: object) => T,
        apiType: APITypeName = "API"
    ): Promise<T> {
        const isGTFS = apiType === "GTFS";
        const url = this.makeApiUrl(this.getApiUrl(apiType), endpoint);
        const response = await (isGTFS ? this.gtfsFetcher : this.fetcher).fetchRaw(url, {
            method: isGTFS || apiType === "UMBRACO" ? "GET" : "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: isGTFS ? undefined : JSON.stringify(body),
            redirect: "follow"
        });

        if (!response.ok) {
            const info = {
                status: response.status.toString(),
                statusText: response.statusText
            };

            if (isGTFS) {
                const parsed = SimpleXMLParser.fromString(await response.text());
                info.statusText = `${parsed.getTag("Code")}: ${parsed.getTag("Message")}`;
            } else if (response.url !== url) {
                const params = new URL(response.url).searchParams;
                info.status = params.get("status")!;
                info.statusText = params.get("message")!;
            }

            throw new Error(
                `Failed to fetch ${endpoint} (${info.status} ${info.statusText}) from ${url}`
            );
        }

        const responseJson = await response.json();
        return ctor ? new ctor(responseJson) : responseJson as T;
    }

    private isRouteName = (l: RouteID | RouteName): l is RouteName => {
        return l.startsWith("L");
    }

    private async findServiceBoundary(
        hasService: (date: Date) => Promise<boolean>,
        type: "start" | "end"
    ): Promise<Date> {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (type === "start") {
            now.setDate(1);
        } else {
            now.setDate(now.getDate() + 1);
        }

        let lower: Date | null = null;
        let upper: Date | null = null;
        let step = 1;

        if (type === "start") {
            while (true) {
                const has = await hasService(now);
                if (has) {
                    upper = now;
                    // Move lower backwards to find a day without service
                    lower = new Date(now);
                    step = 1;
                    while (true) {
                        lower.setDate(lower.getDate() - step);
                        if (lower < new Date(1900, 0, 1)) break;
                        if (!(await hasService(lower))) break;
                        step *= 2;
                        if (step > 365) step = 365;
                    }
                    break;
                }
                now.setDate(now.getDate() + step);
                step *= 2;
                if (step > 365) step = 365;
            }
        } else {
            while (true) {
                const has = await hasService(now);
                if (!has) {
                    upper = now;
                    // move lower backwards to find last day with service
                    lower = new Date(now);
                    step = 1;
                    while (true) {
                        lower.setDate(lower.getDate() - step);
                        if (lower < new Date(1900, 0, 1)) break;
                        if (await hasService(lower)) break;
                        step *= 2;
                        if (step > 365) step = 365;
                    }
                    break;
                }
                now.setDate(now.getDate() + step);
                step *= 2;
                if (step > 365) step = 365;
            }
        }

        // Binary search between lower and upper
        while (lower <= upper) {
            const mid: Date = new Date((lower.getTime() + upper.getTime()) / 2);
            const has = await hasService(mid);
            if (type === "start") {
                if (has) {
                    upper = new Date(mid.getTime() - 86400000);
                } else {
                    lower = new Date(mid.getTime() + 86400000);
                }
            } else {
                if (has) {
                    lower = new Date(mid.getTime() + 86400000);
                } else {
                    upper = new Date(mid.getTime() - 86400000);
                }
            }
        }

        // make upper inclusive, just like lower
        upper = new Date(upper.getTime() - 86400000);

        return type === "start" ? lower : upper;
    }

    private stopIDStrToID(stopID: string): number {
        let hash = 5381;

        for (let i = 0; i < stopID.length; i++) {
            hash = (hash * 33) ^ stopID.charCodeAt(i);
            hash >>>= 0;
        }

        return hash & 0x7FFFFFFF;
    } 


    async getBusList(route: string = ""): Promise<CasaBusAPIResult<{ busList: CasaBusLine[] }>> {
        return await this.fetchJSON<CasaBusAPIResult<{ busList: CasaBusLine[] }>>("/Routes/busList", {
            keyword: route
        });
    }

    @Cache
    async getBusRoutes(): Promise<{ [key in RouteName]: FullRouteDetail }> {
        const routes: { [key in RouteName]: FullRouteDetail } = {} as typeof routes;
        const busList = (await this.getBusList()).data?.busList!;

        for (const bus of busList) {
            const routeInfoResult = await this.getRouteDetails(bus.routeId)!;
            routes[bus.routeShortName] = { ...bus, ...routeInfoResult.data! };
        }

        return routes;
    }

    @Cache
    async getBusRoutesBothDirs(): Promise<{ [key in RouteName]: { 0: FullRouteDetail, 1: FullRouteDetail } }> {
        const routes: { [key in RouteName]: { 0: FullRouteDetail, 1: FullRouteDetail } } = {} as typeof routes;
        const dir0BusRoutes = await this.getBusRoutes();

        for (const [_, detail] of Object.entries(dir0BusRoutes)) {
            const routeInfoResult = await this.getRouteDetails(detail.routeId, 1)!;
            routes[detail.routeShortName] = {
                0: detail,
                1: { ...detail, ...routeInfoResult.data! }
            };
        }

        return routes;
    }

    // missing some routes, see comment below
    @Cache
    async getShapes(): Promise<CasaBusGTFSShapesResponse> {
        return await this.fetchJSON<CasaBusGTFSShapesResponse>("/shapes.json", undefined, undefined, "GTFS");
    }

    // returns 404 on L1, L302 and L308. Last two were added recently on 06/03/2026, L1 is a airport shuttle added 12/2025
    // so no clue why they havent added shapes for them yet. GetRoutePolyline actually works for the missing lines
    async getRouteShape(route: RouteID | RouteName): Promise<CasaBusGTFSShapeResponse> {
        if (this.isRouteName(route)) {
            // @ts-ignore: safe because RouteName is a subset of RouteID, and all RouteNames start with L
            route = RouteNumber[route];
        }

        return await this.fetchJSON<CasaBusGTFSShapeResponse>(`/shape/${route}.json`, undefined, undefined, "GTFS");
    }

    async getRoutePolyline(route: RouteID | RouteName, direction: 0 | 1 = 0): Promise<CasaBusAPIResult<RoutePolylineResponse>> {
        if (this.isRouteName(route)) {
            // @ts-ignore: safe because RouteName is a subset of RouteID, and all RouteNames start with L
            route = RouteNumber[route];
        }

        return await this.fetchJSON<CasaBusAPIResult<RoutePolylineResponse>>("/shape/GetRoutePolyline", {
            routeId: route, isSwitched: direction === 1
        });
    }

    @Cache
    async getShapesIDs(): Promise<{ [key in RouteID]: [RoutePolyline[], RoutePolyline[]] }> {
        const shapesIDs: { [key in RouteID]: [RoutePolyline[], RoutePolyline[]] } = {} as typeof shapesIDs;
        const busses = await this.getBusList();

        for (const bus of busses.data!.busList) {
            const routePolylinesDir0 = (await this.getRoutePolyline(bus.routeId, 0))
                .data!.routePolylines;
            const routePolylinesDir1 = (await this.getRoutePolyline(bus.routeId, 1))
                .data!.routePolylines;

            shapesIDs[bus.routeId] = [routePolylinesDir0, routePolylinesDir1];
        }

        return shapesIDs;
    }

    @Cache
    async getStops(): Promise<CasaBusGTFSStopsResponse> {
        return await this.fetchJSON<CasaBusGTFSStopsResponse>("/stops.json", undefined, undefined, "GTFS");
    }

    async getRouteInfo(routeID: RouteID, direction: 0 | 1 = 0): Promise<CasaBusAPIResult<RouteHeader>> {
        return await this.fetchJSON<CasaBusAPIResult<RouteHeader>>("/Routes/routeHeader", {
            routeID, isSwitched: direction === 1
        });
    }

    @Cache
    async getRouteDetails(routeID: RouteID, direction: 0 | 1 = 0): Promise<CasaBusAPIResult<RouteDetail>> {
        return await this.fetchJSON<CasaBusAPIResult<RouteDetail>>("/Routes/routedetail", {
            routeID, isSwitched: direction === 1
        });
    }

    async getTimetable(
        routeID: RouteID, stopID: string, date: Date = new Date()
    ): Promise<CasaBusAPIResult<RouteTimetableCalendar[]>> {
        return await this.fetchJSON<CasaBusAPIResult<RouteTimetableCalendar[]>>("/Stops/GetHoraireCalendar", {
            routeID, stopID,
            dateSearch: dateToGtfsDate(date)
        });
    }

    @Cache
    async getAllTimetables(): Promise<{ [key in RouteName]: { 0: TimetableEntry[], 1: TimetableEntry[] } }> {
        const timetables: { [key in RouteName]: { 0: TimetableEntry[], 1: TimetableEntry[] } } = {} as typeof timetables;
        const busRoutes = await this.getBusRoutesBothDirs();
        const tasks: Promise<void>[] = [];

        const serviceSuffixes = ["WEEKDAY", "SATURDAY", "SUNDAY"] as const;
        const timetableToDate = {
            WEEKDAY: getClosestWeekday(),
            SATURDAY: getClosestSaturday(),
            SUNDAY: getClosestSunday()
        } as const;

        for (const [routeNameStr, routes] of Object.entries(busRoutes)) {
            const routeName = routeNameStr as RouteName;

            for (const [dirStr, route] of Object.entries(routes)) {
                const dir = parseInt(dirStr) as 0 | 1;

                const departureStop = route.stopInfos.find(s => s.stopName === route.departureStop)!;
                const arrivalStop = route.stopInfos.find(s => s.stopName === route.arrivalStop)!;

                for (const stop of route.stopInfos) {
                    for (const serviceType of serviceSuffixes) {
                        const date = timetableToDate[serviceType];

                        tasks.push((async () => {
                            const timetable = (await this.getTimetable(route.routeId, stop.stopId, date)).data!;
    
                            if (!timetables[routeName]) {
                                timetables[routeName] = { 0: [], 1: [] };
                            }
    
                            timetables[routeName][dir].push(...timetable.map(entry => ({
                                ...entry,
                                // timetable StopSequence is unreliable, it sometimes returns a random number :sob:
                                stopSequence: stop.stopSequence,
                                departureStop: departureStop.stopName,
                                departureStopId: departureStop.stopId,
                                arrivalStop: arrivalStop.stopName,
                                arrivalStopId: arrivalStop.stopId,
                                serviceType
                            })));
                        })());
                    }
                }
            }
        }

        await Promise.all(tasks);

        return timetables;
    }

    // can't find an api endpoint for this :(
    @Cache
    async getCalendarPerimeter(): Promise<{ start: GtfsDate; end: GtfsDate }> {
        const route1Info = await this.getRouteDetails("1");
        const stopId = route1Info.data!.stopInfos[0].stopId;

        const hasService = async (date: Date): Promise<boolean> => {
            const timetable = await this.getTimetable("1", stopId, date);
            return (timetable.data?.length || 0) > 0;
        };

        const startDate = await this.findServiceBoundary(hasService, "start");
        const endDate = await this.findServiceBoundary(hasService, "end");

        return {
            start: dateToGtfsDate(startDate),
            end: dateToGtfsDate(endDate)
        };
    }

    async getIncidents(routeName?: RouteName): Promise<CasaBusAPIResult<CasaBusIncidentsResponse>> {
        return await this.fetchJSON<CasaBusAPIResult<CasaBusIncidentsResponse>>(
            `/HomePageContentElementsApi/GetEnDirect/fr-fr/${routeName || ''}`,
            undefined, undefined, "UMBRACO"
        );
    }


    // GTFS data methods

    async getGTFSAgency(_network: string = ""): Promise<string> {
        return await new Promise(resolve => resolve(this.toCsv(
            ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang"] as const,
            [
                ["1", "Alsa", "https://www.casabus.ma", "Africa/Casablanca", "fr"]
            ]
        )));
    }

    async getGTFSRoutes(_network: string = ""): Promise<string> {
        const busRoutes = await this.getBusRoutes();

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
            Object.entries(busRoutes).map(([_, route]) => {
                const departureStop = route.stopInfos.find(s => s.stopName === route.departureStop)!;
                const arrivalStop = route.stopInfos.find(s => s.stopName === route.arrivalStop)!;

                return [
                    route.routeShortName,
                    "1",
                    route.routeShortName,
                    `${fixCBStopName(
                        departureStop.stopId, departureStop.stopName
                    )} - ${fixCBStopName(
                        arrivalStop.stopId, arrivalStop.stopName
                    )}`,
                    TransportType.BUS,
                    route.routeColor,
                    route.routeTextColor
            ]})
        );
    }

    async getGTFSStops(_network: string = ""): Promise<string> {
        // gtfs api is missing stops for L1 and maybe other lines idk
        // const stops = await this.getStops();
        const busRoutes = await this.getBusRoutesBothDirs();
        const stops = Object.values(busRoutes).flatMap(({ 0: dir0, 1: dir1 }) => [
            ...dir0.stopInfos, ...dir1.stopInfos
        ]);
        const dedupedStops = deduplicateByKey(stops, "stopId");

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
                "wheelchair_boarding"
            ] as const,
            dedupedStops.map(stop => [
                this.stopIDStrToID(stop.stopId),
                stop.stopId,
                fixCBStopName(stop.stopId, stop.stopName),
                "",
                stop.stopLat,
                stop.stopLon,
                "",
                "",
                "",
                ""
            ])
        );
    }

    async getGTFSShapes(_network: string = ""): Promise<string> {
        const shapes = await this.getShapesIDs();
        const allShapes = deduplicateByDeepEquality(
            Object.values(shapes).flatMap(([dir0, dir1]) => [...dir0, ...dir1])
        );

        return this.toCsv(
            [
                "shape_id",
                "shape_pt_lat",
                "shape_pt_lon",
                "shape_pt_sequence",
                "shape_dist_traveled"
            ] as const,
            allShapes.map(shape => [
                shape.shapeId,
                shape.latitude,
                shape.longitude,
                shape.pointSequence,
                shape.distance
            ])
        );
    }

    async getGTFSTrips(_network: string = ""): Promise<string> {
        const timetables = await this.getAllTimetables();
        const shapesIDs = await this.getShapesIDs();
        const rows: [
            /* route_id: */ RouteName,
            /* service_id: */ string,
            /* trip_id: */ string,
            /* trip_headsign: */ string,
            /* trip_short_name: */ string,
            /* direction_id: */ 0 | 1,
            /* block_id: */ string,
            /* shape_id: */ string,
            /* wheelchair_accessible: */ string,
            /* bikes_allowed: */ string
        ][] = [];

        for (const [routeNameStr, routeTimetables] of Object.entries(timetables)) {
            const routeName = routeNameStr as RouteName;

            for (const [dirStr, timetableEntries] of Object.entries(routeTimetables)) {
                const dir = parseInt(dirStr) as 0 | 1;

                for (const tripID of new Set(timetableEntries.map(e => e.tripId))) {
                    const trip = timetableEntries.find(e => e.tripId === tripID)!;

                    rows.push([
                        routeName,
                        `SVC_${trip.serviceType}`,
                        `${trip.tripId}-${dir}`,
                        fixCBStopName(trip.arrivalStopId, trip.arrivalStop),
                        "",
                        dir,
                        "",
                        // @ts-ignore: safe because RouteName is a subset of RouteID, and all RouteNames start with L
                        shapesIDs[RouteNumber[routeName]][dir][0].shapeId,
                        "",
                        ""
                    ]);
                }
            }
        }

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
            rows
        );
    }

    async getGTFSStopTimes(_network: string = ""): Promise<string> {
        const timetables = await this.getAllTimetables();
        const rows: [
            /* trip_id: */ string,
            /* arrival_time: */ string,
            /* departure_time: */ string,
            /* stop_id: */ number,
            /* stop_sequence: */ number,
            /* pickup_type: */ number,
            /* drop_off_type: */ number
        ][] = [];

        for (const [_, routeTimetables] of Object.entries(timetables)) {
            for (const [dirStr, timetableEntries] of Object.entries(routeTimetables)) {
                const dir = parseInt(dirStr) as 0 | 1;

                timetableEntries.sort((a, b) => parseInt(a.stopSequence) - parseInt(b.stopSequence));

                for (const entry of timetableEntries) {
                    rows.push([
                        `${entry.tripId}-${dir}`,
                        entry.arrivalTime,
                        entry.departureTime,
                        this.stopIDStrToID(entry.stopId),
                        parseInt(entry.stopSequence),
                        0,
                        0
                    ]);
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
            ] as const,
            rows
        );
    }

    async getGTFSCalendar(_network: string = ""): Promise<string> {
        const { start, end } = await this.getCalendarPerimeter();

        return await new Promise(resolve => resolve(this.toCsv(
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
                ["SVC_SUNDAY", 0, 0, 0, 0, 0, 0, 1, start, end]
            ]
        )));
    }

    async getGTFSFeedInfo(_network: string = ""): Promise<string> {
        const { start, end } = await this.getCalendarPerimeter();

        return await new Promise(resolve => resolve(this.toCsv(
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
        )));
    }

    async getAllGTFS(network: string = ""): Promise<GtfsExportBundle> {
        const [
            agency, routes, trips,
            shapes, stopTimes, stops,
            calendar, feedInfo
        ] = await Promise.all([
            this.exportLogWrapper("agency.txt", this.getGTFSAgency, network),
            this.exportLogWrapper("routes.txt", this.getGTFSRoutes, network),
            this.exportLogWrapper("trips.txt", this.getGTFSTrips, network),
            this.exportLogWrapper("shapes.txt", this.getGTFSShapes, network),
            this.exportLogWrapper("stop_times.txt", this.getGTFSStopTimes, network),
            this.exportLogWrapper("stops.txt", this.getGTFSStops, network),
            this.exportLogWrapper("calendar.txt", this.getGTFSCalendar, network),
            this.exportLogWrapper("feed_info.txt", this.getGTFSFeedInfo, network)
        ]);

        return {
            "agency.txt": agency,
            "routes.txt": routes,
            "trips.txt": trips,
            "shapes.txt": shapes,
            "stop_times.txt": stopTimes,
            "stops.txt": stops,
            "calendar.txt": calendar,
            "feed_info.txt": feedInfo
        };
    }
}
