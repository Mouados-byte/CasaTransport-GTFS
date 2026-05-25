import { GtfsExportBundle } from "./types/types.ts";
import GTFSExporter from "./GTFSExporter.ts";

export default class CasaBuswayGTFS extends GTFSExporter {
    // TODO: hopefully busway also has json endpoints :pray:

    async getGTFSAgency(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSRoutes(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSStops(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSShapes(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSFrequencies(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSTrips(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSStopTimes(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSCalendar(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSCalendarDates(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getGTFSFeedInfo(network: string): Promise<string> {
        throw new Error("Method not implemented.");
    }

    async getAllGTFS(network: string = ""): Promise<GtfsExportBundle> {
        throw new Error("Method not implemented.");
    }

    async exportGTFSToDirectory(outputDirectory: string, network: string = ""): Promise<GtfsExportBundle> {
        throw new Error("Method not implemented.");
    }
}
