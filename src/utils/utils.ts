import { eachWeekendOfYear } from "date-fns";
import {
    CACHE_DIRECTORY,
    CALENDARIFIC_API_KEY,
    CASATRAMWAY_ROUTE_PLANNER_WIDGET_URI
} from "../constants.ts";
import { ICalendarificResponse, HolidaysSundaysCache } from "@local-types/calendarific.ts";
import { GtfsDate, TransformKeysUncapitalize } from "@local-types/types.ts";

export const dateToCasaTramwayDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
}

export const toGtfsDate = (isoDate: string): GtfsDate => {
    return isoDate.replaceAll('-', '') as GtfsDate;
}

export const dateToGtfsDate = (date: Date): GtfsDate => {
    return toGtfsDate(dateToCasaTramwayDate(date)) as GtfsDate;
}

export const fromGtfsDate = (gtfsDate: GtfsDate): string => {
    return gtfsDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
}

export const dateFromGtfsDate = (gtfsDate: GtfsDate): Date => {
    return new Date(
        `${gtfsDate.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3")}T00:00:00`
    );
}

export const minutesToTime = (minutes: number, withSeconds: boolean = false): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}${withSeconds ? ":00" : ''}`;
}

export const moveArrayElement = <T>(arr: T[], fromIdx: number, toIdx: number): void => {
    const elem = arr[fromIdx];

    if (toIdx < 0) toIdx = arr.length + toIdx;

    arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, elem);
}

export const normalizeStopName = (name: string): string => {
    name = name.replace(/[’‘]/g, "'")
        .replace(/[“”]/g, '"')
        .replace(/[—–]/g, '-')
        .replace(/…/g, "...");

    const splitName = name.split(' ');
    if (splitName.length === 0) return name;

    return name
        .toLowerCase()
        .split(/(\s+|-+|'+)/)
        .map(part => {
            if (/^[\s\-']+$/.test(part)) return part;
            return part.charAt(0).toUpperCase() + part.slice(1);
        })
        .join('');
}

export const safeGet = <T extends object, K extends keyof T = keyof T>(
    obj: T, key: string
): T[K] | undefined => {
    return key in obj ? obj[key as K] : undefined;
}

export const deduplicateByKey = <T, K extends keyof T>(arr: T[], key: K): T[] => {
    const seen = new Map<T[K], T>();

    for (const item of arr) {
        if (!seen.has(item[key])) {
            seen.set(item[key], item);
        }
    }

    return Array.from(seen.values());
}

export const deduplicateByDeepEquality = <T>(arr: T[]): T[] => {
    const seen = new Set<string>();

    return arr.filter(item => {
        const key = JSON.stringify(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

// deno-lint-ignore no-explicit-any
export const toLowerKeys = <T extends Record<string, any>>(obj: T): TransformKeysUncapitalize<T> => {
    // deno-lint-ignore no-explicit-any
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key.charAt(0).toLowerCase() + key.slice(1)] = value;
    }
    return result;
}

// deno-lint-ignore no-explicit-any
export const fromLowerKeys = <T extends Record<string, any>>(obj: TransformKeysUncapitalize<T>): T => {
    // deno-lint-ignore no-explicit-any
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
        result[key.charAt(0).toUpperCase() + key.slice(1)] = value;
    }
    return result;
}

export const getMoroccanHolidays = async (year: number): Promise<GtfsDate[]> => {
    const url = `https://calendarific.com/api/v2/holidays?api_key=${CALENDARIFIC_API_KEY}&country=MA&year=${year}`;

    const response = await fetch(url);
    const data: ICalendarificResponse = await response.json();

    if (!response.ok) {
        throw new Error(`Failed to fetch holidays: ${response.status} ${data.meta.error_detail!}`);
    }

    return data.response.holidays!
        .filter(holiday => holiday.type.includes("National holiday"))
        .map(holiday => toGtfsDate(holiday.date.iso));
}

export const getAllSundays = (year: number): GtfsDate[] => {
    return eachWeekendOfYear(new Date(year, 0, 1))
        .filter(date => date.getDay() === 0)
        .map(date => toGtfsDate(date.toISOString().slice(0, 10)));
}

export const getClosestWeekday = (date: Date = new Date(), exceptions: readonly GtfsDate[] = []): Date => {
    const exceptionsDates = exceptions.map(date => dateFromGtfsDate(date));
    date.setHours(0, 0, 0, 0);

    while (
        (date.getDay() === 0 || date.getDay() === 6) ||
        exceptionsDates.some(ex => ex.getTime() === date.getTime())
    ) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}

export const getClosestSaturday = (date: Date = new Date(), exceptions: readonly GtfsDate[] = []): Date => {
    const exceptionsDates = exceptions.map(date => dateFromGtfsDate(date));
    date.setHours(0, 0, 0, 0);

    while (
        date.getDay() !== 6 ||
        exceptionsDates.some(ex => ex.getTime() === date.getTime())
    ) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}

export const getClosestSunday = (date: Date = new Date()): Date => {
    date.setHours(0, 0, 0, 0);

    while (date.getDay() !== 0) {
        date.setDate(date.getDate() + 1);
    }

    return date;
}

export const getHolidaysSundaysCache = async (): Promise<HolidaysSundaysCache> => {
    const currentYear = new Date().getFullYear();
    const filepath = `${CACHE_DIRECTORY}/holidays_sundays.json`;
    const allHolidays: HolidaysSundaysCache = {
        holidays: [],
        sundays: []
    };

    try {
        const content = await Deno.readTextFile(filepath);
        Object.assign(allHolidays, JSON.parse(content) as HolidaysSundaysCache);

        if (allHolidays.holidays[0].slice(0, 4) !== currentYear.toString()) {
            await Deno.remove(filepath);
            Object.assign(allHolidays, await getHolidaysSundaysCache());
        }
    } catch (error: unknown) {
        if (!(error instanceof Deno.errors.NotFound)) {
            throw new Error(`Failed to read holidays cache: ${(<Error>error).message}`);
        }

        const holidays = await getMoroccanHolidays(currentYear);
        const sundays = getAllSundays(currentYear);

        const holidaySet = new Set(holidays);
        const filteredSundays = sundays.filter(sunday => !holidaySet.has(sunday)).sort();
        Object.assign(allHolidays, {
            holidays: holidays.sort(),
            sundays: filteredSundays.sort()
        });

        await Deno.writeTextFile(filepath, JSON.stringify(allHolidays, null, 4));
    }

    return allHolidays;
}

export const getRoutePlannerSessionCookie = async (): Promise<{ cookie: string, expiresAt: string }> => {
    const filepath = `${CACHE_DIRECTORY}/route_planner_cookie.json`;
    const cookieData = {
        cookie: "",
        expiresAt: ""
    };

    try {
        const content = await Deno.readTextFile(filepath);
        const { cookie, expiresAt } = JSON.parse(content) as typeof cookieData;

        if (new Date(expiresAt) <= new Date()) {
            await Deno.remove(filepath);
            return await getRoutePlannerSessionCookie();
        }

        cookieData.cookie = cookie;
        cookieData.expiresAt = expiresAt;
    } catch (error: unknown) {
        if (!(error instanceof Deno.errors.NotFound)) {
            throw new Error(`Failed to read Route Planner cache: ${(<Error>error).message}`);
        }

        const widgetUrl = new URL(CASATRAMWAY_ROUTE_PLANNER_WIDGET_URI);
        widgetUrl.search = new URLSearchParams({
            token: "CASATRAMWAY",
            internal: "true",
            redirection: "false"
        }).toString();
        const reqBody: RequestInit = {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
                "Sec-GPC": "1",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
                Host: "sim.105.prod.instant-system.com"
            },
            referrer: widgetUrl.toString(),
            method: "GET",
            redirect: "follow"
        };

        let response = await fetch(widgetUrl, reqBody);

        // TODO: temp
        let retry = 0;
        while (!response.ok && retry < 6) {
            response = await fetch(widgetUrl, reqBody);
            retry++;
            await new Promise(r => setTimeout(r, 1000 * retry));
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch route planner widget: ${response.status} ${response.statusText}`);
        }

        cookieData.cookie = response.headers.getSetCookie()!.find(
            c => c.startsWith("PHPSESSID=")
        )!.split(';')[0].split('=')[1];
        // both date and expiresAt are the time the request was made ???
        // cookieData.expiresAt = new Date(response.headers.get("expires")!).toISOString();
        // TODO: is 1 hour correct?
        cookieData.expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

        await Deno.writeTextFile(filepath, JSON.stringify(cookieData, null, 4));
    }

    return cookieData;
}

export const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // metres
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}
