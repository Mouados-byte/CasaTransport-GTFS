import type { GtfsExportFileName, LineNumber, LineFrequency } from "./types/types.ts";
import type { RateLimitConfig } from "./utils/RatelimitedFetcher.ts";
import { TimeBasedValue } from "./utils/TimeRange.ts";

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
}

export const CASATRAMWAY_ROUTE_PLANNER_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 10,
    requestsPerMinute: 600,
    maxRetries: 5,
    baseDelayMs: 1000
}
