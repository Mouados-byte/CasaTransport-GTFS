import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import type { CasaBusIncidentsResponse } from "@bus-types/types.ts";

const { transit_realtime } = GtfsRealtimeBindings;

type Incident = CasaBusIncidentsResponse["busLiveList"][number];

// The API sends Morocco local time without an offset, and "0001-01-01T00:00:00" for "no end".
// ponytail: fixed +01:00, wrong by an hour during Ramadan when Morocco moves to UTC+0
const toEpoch = (date: string): number | undefined => {
    const ms = Date.parse(/[zZ]|[+-]\d\d:\d\d$/.test(date) ? date : `${date}+01:00`);
    return Number.isNaN(ms) || ms < 0 ? undefined : Math.floor(ms / 1000);
};

// Incidents write L009E where the feed route id is L09E
const toFeedRouteId = (routeId: string) => routeId.length > 4 ? routeId.replace(/^L0/, "L") : routeId;

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
                    informedEntity: [{ routeId: `${routePrefix}${toFeedRouteId(incident.routeId || incident.route)}` }],
                    // titles are only "Perturbation sur: ", the place is in the text
                    headerText: text(`${incident.title}${incident.text}`.trim()),
                    descriptionText: text(incident.text)
                }
            };
        })
    });

    return transit_realtime.FeedMessage.encode(feed).finish();
};
