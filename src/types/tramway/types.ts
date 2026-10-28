// @deno-types="@proto/orchestraProto.d.ts"
import { proto } from "@proto/orchestraProto.js";
import { TimeBasedValue } from "@utils/TimeRange.ts";
import type Line from "./line.ts";
import type { BasicLine, ILineWithStopTimes } from "./line.ts";
import type { AtLeastOne } from "@local-types/types.ts";

// some types taken from casatramway.ma

export type BooleanString = "yes" | "no";
export const boolStrToBool = (s: BooleanString): boolean => s === "yes";
export const boolToBoolStr = (b: boolean): BooleanString => b ? "yes" : "no";

export type TStopDepartures = {
    [key in `${LineNumber}_${'0' | '1'}`]?: ILineWithStopTimes;
}

export const enum TransportCategory {
    TRAMWAY = "Lignes Tramway",
    BUSWAY = "Lignes Busway"
}

export const enum AgencyType {
    Casatramway = "Casatramway",
    Casabusway = "Casabusway"
}

export const enum LineNumber {
    T1 = "T1",
    T2 = "T2",
    T3 = "T3",
    T4 = "T4",
    BW1 = "BW1",
    BW2 = "BW2"
}

export type LineName = keyof typeof LineNumber;

export interface LineFrequency {
    weekday: TimeBasedValue<number>;
    saturday: TimeBasedValue<number>;
    sunday_holiday: TimeBasedValue<number>;
}

export interface Dest {
    id: string;
    name: string;
    service: string;
}

export interface Coordinates {
    Longitude: string;
    Latitude: string;
}

/**
 * @template T Lines either needs at least one key (T extends false) or can be empty (T extends true)
 */
export interface StopPoint<T extends boolean> {
    HandAccess: boolean;
    Lines: T extends false
        ? AtLeastOne<{ [key in LineName]: BasicLine }>
        : { [key in LineName]?: BasicLine };
    Location: Coordinates;
    StopCity: string;
    StopName: { value: string };
    StopPointRef: string;
    StopStreet: string;
    StopStreetNumber: string;
    wheelchair_boarding?: 1 | 0;
}

export interface GtfsData {
    stops: { [key: string]: StopPoint<false> };
    lines: { [key in LineNumber]: Line };
}

export interface GtfsProtoData {
    stops: { [key: string]: proto.Stop };
    lines: { [key in LineNumber]: proto.Line };
}

export interface StopsByDestination {
    destinationName: string;
    stopsRefs: string[];
}

export interface StopsByLine {
    line: proto.Line;
    stopsByDestinations: StopsByDestination[];
}

export interface StopsByLineCategory {
    category: string;
    lineStops: StopsByLine[];
}

export interface CalendarPerimeter {
    start: string;
    end: string;
}

export interface LineInfos {
    dir0_label: string;
    dir1_label: string;
}

export interface DeparturesOptions {
    date?: string;
    time?: string;
    limit?: number;
    nbpasttimes?: number;
    pastsince?: number;
    simulateOccupancy?: boolean;
}

export interface IScheduleStopTime {
    ServiceId: string;
    ShapeId: string;
    sequenceId: string;
    journeyId: string;
    ArrTime: string;
    ArrTimeUTC: string;
    DepTime: string;
    DepTimeUTC: string;
    tripHeadsign: string;
    wheelchair_accessible: "0" | "1";
    from_stop_name: string;
    to_stop_name: string;
    pickup: "0" | "1";
    dropOff: "0" | "1";
    tad: boolean;
    DepTerm: string;
    realTime: {
        time: string;
        [key: string]: unknown; // always null, so dont know other fields
    } | null;
}

export interface ComputedTime {
    date: Date;
    minutes: number;
    time: string;
    isLive: boolean;
    isCanceled: boolean;
    tripHeadsign?: string;
    journeyId?: string;
}

export interface Destination {
    mnemoService: string;
    serviceId: string;
    line: Line;
    direction?: string;
    dirlib?: string;
    fromlib?: string;
    times: ComputedTime[];
}

export interface DiscoveryResponse<T, K extends string | number | symbol = string> {
    infos: {
        page_current?: number;
        page_prev?: number | null;
        page_next?: number | null;
        page_last?: number;
        page_items_nb?: number;
        total_items?: number;
        results_date_time: string;
    };
    items: T[] | { [key in K]?: T };
}


export interface RoutePlannerDeparture {
    id: string;
    value: string;
    latlon: string;
    latitude: string;
    longitude: string;
}

export interface RoutePlannerDestination {
    type: "ADDRESS" | "STOPAREA" | "STOPPOINT";
    id: string;
    name: string;
    lat: number;
    lon: number;
    city: string;
    wheelchairboarding?: "YES" | "NO";
    stopareaid?: string;
    postalCode?: string;
    realtime: number;
};

export interface RoutePlannerStopPoint {
    id: string;
    name: string;
    city: string;
    lat: number;
    lon: number;
    realtime: number;
};

export interface RoutePlannerLeg {
    mode: "WALK" | "TRAM" | "BUS";
    start: RoutePlannerDestination;
    end: RoutePlannerDestination;
    duration: number; // seconds
    stoppoints: RoutePlannerStopPoint[];
};

// wtf...
export interface RoutePlannerResponse {
    response: {
        tripPlanner: {
            TRANSPORT: {
                estimatedResults: boolean;
                errors: unknown[];
                groups: [{
                    groupId: string;
                    display: boolean;
                    errors: { message: string }[];
                    results: {
                        journeys_id: string;
                        timestamp: string;
                        journeycount: number;
                        errorcode: number;
                        errormessagefr: string;
                        nextStartDate: string;
                        previousArrivalDate: string;
                        nextStartDateIso8601: string;
                        previousArrivalDateIso8601: string;
                        from: RoutePlannerDestination;
                        to: RoutePlannerDestination;
                        errors: {
                            type: string;
                            code: string;
                            message: string;
                        }[];
                        journeys: {
                            // whole lotta other keys that i dont care about
                            paths: RoutePlannerLeg[];
                        }[];
                    };
                }];
            };
        };
        departurePlace: RoutePlannerDeparture;
        arrivalPlace: RoutePlannerDeparture;
    };
    content: string;
}
