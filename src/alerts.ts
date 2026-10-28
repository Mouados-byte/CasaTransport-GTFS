import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { CasaBusIncidentsResponse } from "@bus-types/types.ts";

const { transit_realtime } = GtfsRealtimeBindings;

type Incident = CasaBusIncidentsResponse["busLiveList"][number];

const toEpoch = (date: string): number | undefined => {
    const ms = Date.parse(date);
    return Number.isNaN(ms) ? undefined : Math.floor(ms / 1000);
};

/**
 * Converts Casabus live incidents into a GTFS-Realtime service alerts feed.
 * route_id is prefixed with `routePrefix` so it matches the merged feed ("bus:L001").
 */
export const incidentsToAlerts = (
    incidents: Incident[],
    routePrefix: string = "",
    now: Date = new Date()
): Uint8Array => {
    const text = (value: string) => ({ translation: [{ text: value, language: "fr" }] });

    const feed = transit_realtime.FeedMessage.create({
        header: {
            gtfsRealtimeVersion: "2.0",
            incrementality: transit_realtime.FeedHeader.Incrementality.FULL_DATASET,
            timestamp: Math.floor(now.getTime() / 1000)
        },
        entity: incidents.map(incident => {
            const start = toEpoch(incident.dateDebut);
            const end = toEpoch(incident.dateFin);

            return {
                id: incident.id,
                alert: {
                    activePeriod: start || end ? [{ start, end }] : [],
                    informedEntity: [{ routeId: `${routePrefix}${incident.routeId || incident.route}` }],
                    headerText: text(incident.title),
                    descriptionText: text(incident.text)
                }
            };
        })
    });

    return transit_realtime.FeedMessage.encode(feed).finish();
};
