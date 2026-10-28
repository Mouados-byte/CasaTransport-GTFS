import {
    CASABUS_API_URI, CASABUS_GTFS_URI, CASABUS_UMBRACO_URI
} from "@src/constants.ts";
import { TransformKeysUncapitalize } from "@local-types/types.ts";

export const enum RouteNumber {
    L001 = "1",
    L005 = "5",
    L006 = "6",
    L007 = "7",
    L09E = "9E",
    L011 = "11",
    L013 = "13",
    L019 = "19",
    L020 = "20",
    L022 = "22",
    L023 = "23",
    L031 = "31",
    L32D = "32D",
    L033 = "33",
    L038 = "38",
    L039 = "39",
    L040 = "40",
    L043 = "43",
    L050 = "50",
    L051 = "51",
    L055 = "55",
    L056 = "56",
    L060 = "60",
    L062 = "62",
    L063 = "63",
    L064 = "64",
    L065 = "65",
    L067 = "67",
    L068 = "68",
    L072 = "72",
    L079 = "79",
    L082 = "82",
    L084 = "84",
    L090 = "90",
    L097 = "97",
    L97B = "97B",
    L107 = "107",
    L109 = "109",
    L120 = "120",
    L139 = "139",
    L143 = "143",
    L300 = "300",
    L301 = "301",
    L302 = "302",
    L306 = "306",
    L307 = "307",
    L308 = "308",
    L309 = "309",
    L310 = "310",
    L312 = "312",
    L600 = "600",
    L604 = "604",
    L606 = "606",
    L608 = "608",
    L800 = "800",
    L900 = "900",
    L902 = "902",
    L903 = "903",
    L904 = "904",
    L905 = "905",
    L906 = "906",
    L907 = "907"
}

export type RouteName = keyof typeof RouteNumber;
export type RouteID = `${RouteNumber}`;

export const APIType = {
    API: CASABUS_API_URI,
    GTFS: CASABUS_GTFS_URI,
    UMBRACO: CASABUS_UMBRACO_URI
} as const;

export type APITypeName = keyof typeof APIType;


export interface ShapeCoordinate {
    lat: number;
    lon: number;
}

export interface CasaBusGTFSShape {
    shape_id: string;
    route_color: string | null;
    coordinates: ShapeCoordinate[];
}

export interface CasaBusGTFSIndividualShape {
    ShapeId: string;
    Latitude: string;
    Longitude: string;
    PointSequence: string;
    Distance: string;
}

export type CasaBusGTFSShapesResponse = CasaBusGTFSShape[];

export interface CasaBusGTFSShapeResponse {
    RoutePolylines: CasaBusGTFSIndividualShape[];
}

export interface CasaBusGTFSStop {
    StopId: string;
    StopName: string;
    DirectionId: string;
    RouteId: string;
    LigneName: string;
    RouteColor: string;
    RouteTextColor: string;
    StopLat: string;
    StopLon: string;
}

export type CasaBusGTFSStopsResponse = CasaBusGTFSStop[];


export interface CasaBusAPIResult<T> {
    totalRecords?: number;
    success: boolean;
    message: string;
    data?: T;
}

export interface CasaBusLine {
    arrivalStop: string | null; // api returns null
    departureStop: string | null;
    routeId: RouteID;
    routeShortName: RouteName;
    routeColor: string;
    routeTextColor: string;
}

export interface RouteHeader {
    price: number;
    route_id: RouteID;
    departure_stop: string;
    arrival_stop: string;
    departure_time: string; // HH:MM:SS
    arrival_time: string; // HH:MM:SS
    frequency: number; // minutes
    duree_trajet: number; // minutes
}

export interface RouteStop {
    tripId: string;
    stopId: string;
    stopName: string;
    departureTime: string; // HH:MM:SS
    stopSequence: string;
    stopLat: string;
    stopLon: string;
}

export interface RouteDetail {
    routeId: RouteID;
    routeShortName: RouteName;
    routeColor: string;
    departureStop: string;
    arrivalStop: string;
    price: number;
    frequency: number;
    stopInfos: RouteStop[];
}

export interface FullRouteDetail extends CasaBusLine, RouteDetail {
    arrivalStop: string;
    departureStop: string;
}

// lovely api
export type RoutePolyline = TransformKeysUncapitalize<CasaBusGTFSIndividualShape>;

export interface RoutePolylineResponse {
    routePolylines: RoutePolyline[];
}

export interface RouteTimetableCalendar {
    hh: number;
    mm: number;
    tripId: string;
    departureTime: string; // HH:MM:SS
    arrivalTime: string; // HH:MM:SS
    stopId: string;
    routeId: RouteID;
    stopSequence: string;
    dateSearch: string;
}

export interface TimetableEntry extends RouteTimetableCalendar {
    serviceType: "WEEKDAY" | "SATURDAY" | "SUNDAY";
    departureStop: string;
    departureStopId: string;
    arrivalStop: string;
    arrivalStopId: string;
}

export interface CasaBusIncidentsResponse {
    lastUpdate: string;
    busLiveList: {
        id: string;
        title: string;
        text: string;
        // not always a RouteName: live data has "L009E" for L09E
        route: string;
        routeId: string;
        duration: string;
        blockCreationTime: string;
        dateDebut: string;
        dateFin: string;
    }[];
}
