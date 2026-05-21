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

export const toGtfsDate = (isoDate: string): string => {
    return isoDate.replaceAll("-", "");
}

export const moveElement = <T>(arr: T[], fromIdx: number, toIdx: number): void => {
    const elem = arr[fromIdx];

    if (toIdx < 0) toIdx = arr.length + toIdx;

    arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, elem);
}

export const getMoroccanHolidays = async (year: number): Promise<string[]> => {
    console.log("fetching holidays")
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

export const getAllSundays = (year: number): string[] => {
    return eachWeekendOfYear(new Date(year, 0, 1))
        .filter(date => date.getDay() === 0)
        .map(date => toGtfsDate(date.toISOString().slice(0, 10)));
}

export const getHolidaysSundaysCache = async (): Promise<string[]> => {
    const currentYear = new Date().getFullYear();
    const filepath = fromFileUrl(
        new URL("../../cache/holidays_sundays.json", import.meta.url)
    ).replaceAll("\\", "/");
    let allHolidays: string[] = [];

    try {
        const content = await Deno.readTextFile(filepath);
        allHolidays = JSON.parse(content) as string[];

        if (allHolidays[0].slice(0, 4) !== currentYear.toString()) {
            await Deno.remove(filepath);
            allHolidays = await getHolidaysSundaysCache();
        }
    } catch (error: unknown) {
        if (!(error instanceof Deno.errors.NotFound)) {
            throw new Error(`Failed to read holidays cache: ${(<Error>error).message}`);
        }

        const holidays = await getMoroccanHolidays(currentYear);
        const sundays = getAllSundays(currentYear);
        allHolidays = [...new Set([...holidays, ...sundays])].sort();

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
