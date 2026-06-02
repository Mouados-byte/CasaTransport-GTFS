import { GtfsExportBundle, GtfsExportFileName } from "@local-types/types.ts";
import { RateLimitConfig, RateLimitedFetcher } from "@utils/RatelimitedFetcher.ts";

import logger from "@utils/log.ts";

export default abstract class GTFSExporter {
    public fetcher: RateLimitedFetcher;

    constructor(ratelimitConfig?: RateLimitConfig) {
        this.fetcher = new RateLimitedFetcher(ratelimitConfig);
    }

    /**
     * Returns the GTFS agency.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#agencytxt
     */
    abstract getGTFSAgency(network: string): Promise<string>;
    /**
     * Returns the GTFS routes.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#routestxt
     */
    abstract getGTFSRoutes(network: string): Promise<string>;
    /**
     * Returns the GTFS stops.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#stopstxt
     */
    abstract getGTFSStops(network: string): Promise<string>;
    /**
     * Returns the GTFS shapes.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#shapestxt
     */
    abstract getGTFSShapes(network: string): Promise<string>;
    /**
     * Returns the GTFS frequencies.txt as a csv string. Optional.
     * @see https://gtfs.org/documentation/schedule/reference/#frequenciestxt
     */
    protected getGTFSFrequencies(_network: string): Promise<string> {
        return Promise.resolve('');
    }
    /**
     * Returns the GTFS trips.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#tripstxt
     */
    abstract getGTFSTrips(network: string): Promise<string>;
    /**
     * Returns the GTFS stop_times.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#stop_timestxt
     */
    abstract getGTFSStopTimes(network: string): Promise<string>;
    /**
     * Returns the GTFS calendar.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#calendartxt
     */
    abstract getGTFSCalendar(network: string): Promise<string>;
    /**
     * Returns the GTFS calendar_dates.txt as a csv string. Optional.
     * @see https://gtfs.org/documentation/schedule/reference/#calendar_datestxt
     */
    protected getGTFSCalendarDates(_network: string): Promise<string> {
        return Promise.resolve('');
    }
    /**
     * Returns the GTFS feed_info.txt as a csv string.
     * @see https://gtfs.org/documentation/schedule/reference/#feed_infotxt
     */
    abstract getGTFSFeedInfo(network: string): Promise<string>;

    /**
     * Fetches all GTFS files for the given service and returns them as a bundle of csv strings.
     * The keys of the returned object are the GTFS file names (e.g. "agency.txt", "stops.txt", etc...).
     */
    abstract getAllGTFS(network: string): Promise<GtfsExportBundle>;
    /**
     * Writes all GTFS files for the given service to the specified output directory.
     * @param outputDirectory Output directory. The directory will be created if it doesn't exist.
     * @param network
     */
    async exportGTFSToDirectory(
        outputDirectory: string,
        network: string = "",
    ): Promise<GtfsExportBundle> {
        const bundle = await this.getAllGTFS(network);
        await Deno.mkdir(outputDirectory, { recursive: true });
        await Promise.all(
            Object.entries(bundle).map(([fileName, content]) =>
                Deno.writeTextFile(`${outputDirectory}\\${fileName}`, content)
            )
        );

        logger.info("Done exporting GTFS files to directory:", outputDirectory);

        return bundle;
    }


    protected async exportLogWrapper(
        fileName: GtfsExportFileName,
        promise: (n: string) => Promise<string>,
        network: string
    ): Promise<string> {
        logger.info(`Genering GTFS ${fileName}...`);
        const content = await promise.call(this, network);
        logger.info(`Done generating ${fileName}`);
        return content;
    }

    protected csvEscape(value: unknown): string {
        const stringValue =
            value === undefined || value === null ? "" : String(value);
        if (
            stringValue.includes('"') ||
            stringValue.includes(",") ||
            stringValue.includes("\n")
        ) {
            return `"${stringValue.replaceAll('"', '""')}"`;
        }

        return stringValue;
    }

    /**
     * Converts an array of objects to a CSV string with the specified headers in a type-safe manner.
     * @param headers The headers of the CSV file. Must be a tuple of string literals.
     * @param rows The rows of the CSV file.
     * @returns String in CSV format
     */
    protected toCsv<T extends readonly string[]>(
        headers: T,
        rows: Array<{ [K in keyof T]: unknown }>
    ): string {
        const lines = [headers.map((header) => this.csvEscape(header)).join(",")];
        for (const row of rows) {
            lines.push(row.map(value => this.csvEscape(value)).join(","));
        }
        return `${lines.join("\n")}\n`;
    }
};
