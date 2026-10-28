import { parse, stringify } from "@std/csv";
import type { GtfsExportBundle } from "@local-types/types.ts";
import { haversineDistance } from "@utils/utils.ts";

type Table = Record<string, string>[];

const ID_COLUMNS = new Set([
    "agency_id", "route_id", "trip_id", "stop_id", "parent_station", "shape_id",
    "service_id", "fare_id", "from_stop_id", "to_stop_id"
]);

// Station and transfer rules come from the CasaPCIM thesis network build (Imam, Universite
// Hassan II Casablanca): same-name platforms at most 100 m apart are one station, and stops
// at most 400 m apart are a walkable interchange.
const STATION_RADIUS_M = 100;
const TRANSFER_RADIUS_M = 400;
// ponytail: straight line times a detour factor at 1.2 m/s, a pedestrian network would be exact
const WALK_DETOUR = 1.3;
const WALK_SPEED_MPS = 1.2;

const parseTable = (csv: string | undefined): Table =>
    csv?.trim() ? parse(csv, { skipFirstRow: true }) as Table : [];

const toCsv = (rows: Table): string => {
    const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
    return stringify(rows.map(row => Object.fromEntries(columns.map(c => [c, row[c] ?? ""]))), { columns });
};

const isPlatform = (stop: Record<string, string>) => !stop.location_type || stop.location_type === "0";

const stationKey = (name: string) => name
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/\bterminus\b/g, "").replace(/\s+/g, " ").trim();

const distance = (a: Record<string, string>, b: Record<string, string>) => haversineDistance(
    Number(a.stop_lat), Number(a.stop_lon), Number(b.stop_lat), Number(b.stop_lon)
);

/** Groups same-name platforms that are all within STATION_RADIUS_M into parent stations. */
export const addParentStations = (stops: Table): Table => {
    const byName = new Map<string, Table>();
    for (const stop of stops.filter(isPlatform)) {
        const key = stationKey(stop.stop_name);
        byName.set(key, [...(byName.get(key) ?? []), stop]);
    }

    const stations: Table = [];
    for (const group of byName.values()) {
        const clusters: Table[] = [];
        for (const stop of group) {
            const cluster = clusters.find(c => c.every(m => distance(m, stop) <= STATION_RADIUS_M));
            cluster ? cluster.push(stop) : clusters.push([stop]);
        }

        for (const cluster of clusters.filter(c => c.length > 1)) {
            const id = `station:${stations.length + 1}`;
            const mean = (col: string) =>
                (cluster.reduce((sum, s) => sum + Number(s[col]), 0) / cluster.length).toFixed(6);
            stations.push({
                stop_id: id,
                stop_name: cluster[0].stop_name,
                stop_lat: mean("stop_lat"),
                stop_lon: mean("stop_lon"),
                location_type: "1"
            });
            for (const stop of cluster) stop.parent_station = id;
        }
    }

    return [...stops, ...stations];
};

/** Walking transfers between tram or busway stops and any other stop within TRANSFER_RADIUS_M. */
export const walkingTransfers = (stops: Table, isRail: (stopId: string) => boolean): Table => {
    const platforms = stops.filter(isPlatform);
    const transfers: Table = [];

    for (const from of platforms.filter(s => isRail(s.stop_id))) {
        for (const to of platforms) {
            if (from === to) continue;
            const d = distance(from, to);
            if (d > TRANSFER_RADIUS_M) continue;

            const secs = String(Math.ceil(d * WALK_DETOUR / WALK_SPEED_MPS));
            transfers.push({ from_stop_id: from.stop_id, to_stop_id: to.stop_id, transfer_type: "2", min_transfer_time: secs });
            if (!isRail(to.stop_id)) {
                transfers.push({ from_stop_id: to.stop_id, to_stop_id: from.stop_id, transfer_type: "2", min_transfer_time: secs });
            }
        }
    }

    return transfers;
};

/**
 * Merges feeds into one, prefixing every id with the feed key so ids cannot collide,
 * then adds parent stations and walking transfers between the networks.
 */
export const mergeFeeds = (feeds: Record<string, Partial<GtfsExportBundle>>, railFeed: string): GtfsExportBundle => {
    const merged: Record<string, Table> = {};

    for (const [prefix, bundle] of Object.entries(feeds)) {
        for (const [fileName, csv] of Object.entries(bundle)) {
            const rows = parseTable(csv).map(row => Object.fromEntries(
                Object.entries(row).map(([col, value]) =>
                    [col, ID_COLUMNS.has(col) && value ? `${prefix}:${value}` : value]
                )
            ));
            merged[fileName] = [...(merged[fileName] ?? []), ...rows];
        }
    }

    const feedInfo = merged["feed_info.txt"];
    if (feedInfo?.length) {
        merged["feed_info.txt"] = [{
            ...feedInfo[0],
            feed_start_date: feedInfo.map(r => r.feed_start_date).sort()[0],
            feed_end_date: feedInfo.map(r => r.feed_end_date).sort().at(-1)!
        }];
    }

    merged["stops.txt"] = addParentStations(merged["stops.txt"] ?? []);
    merged["transfers.txt"] = walkingTransfers(merged["stops.txt"], id => id.startsWith(`${railFeed}:`));

    return Object.fromEntries(
        Object.entries(merged).filter(([_, rows]) => rows.length).map(([name, rows]) => [name, toCsv(rows)])
    ) as GtfsExportBundle;
};
