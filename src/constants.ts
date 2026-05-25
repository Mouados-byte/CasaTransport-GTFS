import { fromFileUrl } from "deno-mod";

import type { GtfsExportFileName } from "./types/types.ts";
import type { RateLimitConfig } from "./utils/RatelimitedFetcher.ts";

export const BASE_DIR = fromFileUrl(new URL("../", import.meta.url))
    .replaceAll("\\", '/')
    .slice(0, -1);;
export const CACHE_DIRECTORY = `${BASE_DIR}/cache`;

// ensure cache directory exists
await Deno.mkdir(CACHE_DIRECTORY, { recursive: true });

export const OSM_SHAPES_URI = "https://overpass-api.de/api/interpreter";
export const CASATRAMWAY_GTFS_URI = "https://www.casatramway.ma/pthv/get";
export const CASATRAMWAY_ROUTE_PLANNER_URI =
    "https://sim.105.prod.instant-system.com/fr/itineraire";
export const CASATRAMWAY_ROUTE_PLANNER_WIDGET_URI =
    "https://sim.105.prod.instant-system.com/fr/widget/place-journey-map";

export const CALENDARIFIC_API_KEY = Deno.env.get("CALENDARIFIC_API_KEY");

export const GTFS_EXPORT_FILES: readonly GtfsExportFileName[] = [
    "agency.txt",
    "routes.txt",
    "frequencies.txt",
    "trips.txt",
    "stop_times.txt",
    "stops.txt",
    "calendar.txt",
    "calendar_dates.txt",
    "feed_info.txt"
] as const;

export const CASATRAMWAY_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 15,
    requestsPerMinute: 900,
    maxRetries: 5,
    baseDelayMs: 1000
};

export const CASATRAMWAY_ROUTE_PLANNER_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 10,
    requestsPerMinute: 600,
    maxRetries: 5,
    baseDelayMs: 1000
};

export const OSM_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 1,
    requestsPerMinute: 4,
    maxRetries: 3,
    baseDelayMs: 1000
};
