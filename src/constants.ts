import { fromFileUrl } from "deno-mod";

import type { RateLimitConfig } from "@utils/RatelimitedFetcher.ts";

export const BASE_DIR = fromFileUrl(new URL("../", import.meta.url))
    .replaceAll("\\", '/')
    .slice(0, -1);
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

// Google's public Morocco holiday calendar, no key needed
export const MOROCCO_HOLIDAYS_ICS_URI =
    "https://calendar.google.com/calendar/ical/fr.ma%23holiday%40group.v.calendar.google.com/public/basic.ics";

export const FEED_INFO = {
    publisherName: "SpaghettDev",
    publisherUrl: "https://spaghettdev.me",
    lang: "fr",
    version: "1.0",
    contactEmail: "spaghettdev.gtfs@gmail.com",
    contactUrl: "",
    userAgent: "CasaTransportGTFS/1.0 (spaghettdev.gtfs@gmail.com)"
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

// https://www.casatramway.ma/ticket-abonnement/nos-offres (checked 2026-10-28): "8 dh (1 voyage)".
// The 30 minute tram/busway transfer window is from press coverage of the busway launch
// (Medias24, 2024-03-01), not from the operator site.
export const CASATRAMWAY_SINGLE_FARE_MAD = 8;
export const CASATRAMWAY_TRANSFER_WINDOW_SECS = 30 * 60;

// https://www.casabus.ma/titres-de-transport/tarifs/ (checked 2026-10-28). The site writes L032D,
// the API route id is L32D. L302 and L308 are not listed there and get no fare.
export const CASABUS_FARES_MAD: { [price: number]: readonly string[] } = {
    50: ["L001"],
    8: ["L32D", "L120", "L312", "L900"],
    6: [
        "L055", "L068", "L300", "L301", "L306", "L307", "L309", "L310",
        "L600", "L604", "L606", "L608", "L800", "L902", "L903", "L904"
    ],
    5: [
        "L005", "L006", "L007", "L09E", "L011", "L013", "L019", "L020", "L022", "L023",
        "L031", "L033", "L038", "L039", "L040", "L043", "L050", "L051", "L056", "L060",
        "L062", "L063", "L064", "L065", "L067", "L072", "L079", "L082", "L084", "L090",
        "L097", "L97B", "L107", "L109", "L139", "L143", "L905", "L906", "L907"
    ]
};
