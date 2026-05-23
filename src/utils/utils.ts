import { eachWeekendOfYear } from "date-fns";
import { fromFileUrl } from "deno-mod";
import {
    CALENDARIFIC_API_KEY,
    CASATRAMWAY_ROUTE_PLANNER_WIDGET_URI
} from "../constants.ts";

interface ICalendarificResponse {
    meta: {
        code: number;
        error_type?: string;
        error_detail?: string;
    }
    response: {
        holidays?: Array<{
            name: string;
            description: string;
            country: {
                id: string;
                name: string;
            };
            date: {
                iso: string
                datetime: {
                    year: number;
                    month: number;
                    day: number;
                };
            };
            type: string[];
            primary_type: string;
            canonical_url: string;
            locations: string;
            states: string;
        }>;
    };
}

/**
 * String in YYYYMMDD format
 */
export type GtfsDate = string & { __brand: "GtfsDate" };
export interface HolidaysSundaysCache {
    holidays: GtfsDate[];
    sundays: GtfsDate[];
}

export const dateToCasaTramwayDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
}

export const toGtfsDate = (isoDate: string): GtfsDate => {
    return isoDate.replaceAll("-", "") as GtfsDate;
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

export const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
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
        (date.getDate() === 0 || date.getDate() === 6) ||
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
    const filepath = fromFileUrl(
        new URL("../../cache/holidays_sundays.json", import.meta.url)
    ).replaceAll("\\", "/");
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

        await Deno.mkdir(filepath.substring(0, filepath.lastIndexOf("/")), { recursive: true });
        await Deno.writeTextFile(filepath, JSON.stringify(allHolidays, null, 4));
    }

    return allHolidays;
}

export async function getRoutePlannerSessionCookie (): Promise<{ cookie: string, expiresAt: string }> {
    const filepath = fromFileUrl(
        new URL("../../cache/route_planner_cookie.json", import.meta.url)
    ).replaceAll("\\", "/");
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
            throw new Error(`Failed to read holidays cache: ${(<Error>error).message}`);
        }

        const widgetUrl = new URL(CASATRAMWAY_ROUTE_PLANNER_WIDGET_URI);
        widgetUrl.search = new URLSearchParams({
            token: "CASATRAMWAY",
            internal: "true",
            redirection: "false"
        }).toString();

        // TODO: fix random 403 (next request usually works)
        const response = await fetch(widgetUrl, {
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
        });

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

        await Deno.mkdir(filepath.substring(0, filepath.lastIndexOf("/")), { recursive: true });
        await Deno.writeTextFile(filepath, JSON.stringify(cookieData, null, 4));
    }

    return cookieData;
}
