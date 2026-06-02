import { fromFileUrl } from "deno-mod";

import type { RateLimitConfig } from "@utils/RatelimitedFetcher.ts";

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

export const CASABUS_API_URI = "https://api.alsaalbaida.ma/api";
export const CASABUS_GTFS_URI = "https://storageacntcasabusonly.blob.core.windows.net/gtfs";
export const CASABUS_UMBRACO_URI = "https://web.alsaalbaida.ma/umbraco/api";

export const CALENDARIFIC_API_KEY = Deno.env.get("CALENDARIFIC_API_KEY");

export const FEED_INFO = {
    publisherName: "SpaghettDev",
    publisherUrl: "https://spaghettdev.me",
    lang: "fr",
    version: "1.0",
    contactEmail: "spaghettdev-gtfs@gmail.com",
    contactUrl: ""
} as const;

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

export const CASABUS_API_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 8,
    requestsPerMinute: 1000,
    maxRetries: 5,
    maxConcurrent: 6,
    baseDelayMs: 1500
};

export const CASABUS_GTFS_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 15,
    requestsPerMinute: 900,
    maxRetries: 5,
    baseDelayMs: 1000
};

export const OSM_RATELIMIT_CONFIG: RateLimitConfig = {
    requestsPerSecond: 1,
    requestsPerMinute: 4,
    maxRetries: 3,
    baseDelayMs: 1000
};
