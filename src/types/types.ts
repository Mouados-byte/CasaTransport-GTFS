export type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

export type TransformKeysUncapitalize<T> = {
    [K in keyof T as K extends string ? Uncapitalize<K> : never]: T[K];
};

/**
 * String in YYYYMMDD format
 */
export type GtfsDate = string & { __brand: "GtfsDate" };

export type GtfsRequiredExportFileName =
    | "agency.txt"
    | "routes.txt"
    | "trips.txt"
    | "stop_times.txt"
    | "stops.txt"
    | "shapes.txt"
    | "calendar.txt"
    | "feed_info.txt";

export type GtfsOptionalExportFileName =
    | "frequencies.txt"
    | "calendar_dates.txt";

export type GtfsExportFileName =
    | GtfsRequiredExportFileName
    | GtfsOptionalExportFileName;

export type GtfsExportBundle =
    & Record<GtfsRequiredExportFileName, string>
    & Partial<Record<GtfsOptionalExportFileName, string>>;


export const enum TransportMode {
    BUS = "BUS",
    TRAM = "TRAM",
    RAIL = "RAIL",
    SUBWAY = "SUBWAY",
    FERRY = "FERRY",
    CABLECAR = "CABLECAR",
    GONDOLA = "GONDOLA",
    FUNICULAR = "FUNICULAR"
}

export const enum TransportType {
    TRAM = 0,
    SUBWAY = 1,
    RAIL = 2,
    BUS = 3,
    FERRY = 4,
    CABLECAR = 5,
    GONDOLA = 6,
    FUNICULAR = 7,
    TROLLEYBUS = 11,
    MONORAIL = 12
}
