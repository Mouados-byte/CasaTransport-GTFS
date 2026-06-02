import { GtfsDate } from "./types.ts";

export interface ICalendarificResponse {
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

export interface HolidaysSundaysCache {
    holidays: GtfsDate[];
    sundays: GtfsDate[];
}
