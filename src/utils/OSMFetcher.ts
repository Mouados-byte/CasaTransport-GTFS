import { RateLimitedFetcher } from "./RatelimitedFetcher.ts";
import {
    OverpassResponse, OverpassWay,
    OverpassNode, OverpassRelation
} from "../types/osm.ts";
import { LineName } from "../types/types.ts";
import {
    CACHE_DIRECTORY,
    OSM_RATELIMIT_CONFIG,
    OSM_SHAPES_URI
} from "../constants.ts";
import { safeGet } from "./utils.ts";

import logger from "./log.ts";

export default class OSMFetcher {
    private readonly fetcher = new RateLimitedFetcher(OSM_RATELIMIT_CONFIG);
    private filepath: string;

    constructor(instance: string) {
        this.filepath = `${CACHE_DIRECTORY}/osm_${instance}.json`;
    }

    async fetchAndCache(query: string): Promise<OverpassResponse> {
        let data: OverpassResponse;

        try {
            data = JSON.parse(
                await Deno.readTextFile(this.filepath)
            ) as OverpassResponse;

            if (
                new Date(data.osm3s.timestamp_osm_base) >=
                new Date(Date.now() + 24 * 60 * 60 * 1000)
            ) {
                await Deno.remove(this.filepath);
                data = await this.fetchAndCache(query);
            }
        } catch (error) {
            if (!(error instanceof Deno.errors.NotFound)) {
                throw new Error(`Failed to read OSM cache: ${(<Error>error).message}`);
            }

            const response = await this.fetcher.fetchJSON<OverpassResponse>(OSM_SHAPES_URI, {
                    method: "POST",
                    body: new URLSearchParams({ data: query }),
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": "CasaTransportGTFS/1.0"
                    }
                }
            );

            data = response;

            await Deno.writeTextFile(this.filepath, JSON.stringify(data, null, 4));
        }

        return data;
    }

    parseShapes(
        data: OverpassResponse,
        terminalsByLine: {
            [key in LineName]: { dir0Terminal: string; dir1Terminal: string }
        }
    ): Map<string, [number, number][]> {
        const nodes = new Map<number, OverpassNode>();
        const ways = new Map<number, OverpassWay>();
        const relations: OverpassRelation[] = [];

        for (const el of data.elements) {
            if (el.type === "node") nodes.set(el.id, el);
            else if (el.type === "way") ways.set(el.id, el);
            else if (el.type === "relation") relations.push(el);
        }

        const shapes = new Map<string, [number, number][]>();

        for (const rel of relations) {
            const lineRef = rel.tags?.ref as LineName | undefined;
            if (!lineRef) continue;

            const terminals = safeGet(terminalsByLine, lineRef);
            if (!terminals) continue;

            const from = rel.tags?.from;
            const to = rel.tags?.to;

            let dir: 0 | 1 | null = null;

            const matchesDir0From = from && this.terminalMatch(from, terminals.dir0Terminal);
            const matchesDir0To   = to   && this.terminalMatch(to,   terminals.dir1Terminal);
            const matchesDir1From = from && this.terminalMatch(from, terminals.dir1Terminal);
            const matchesDir1To   = to   && this.terminalMatch(to,   terminals.dir0Terminal);

            const scoreDir0 = (matchesDir0From ? 1 : 0) + (matchesDir0To ? 1 : 0);
            const scoreDir1 = (matchesDir1From ? 1 : 0) + (matchesDir1To ? 1 : 0);

            if (scoreDir0 > scoreDir1)      dir = 0;
            else if (scoreDir1 > scoreDir0) dir = 1;

            if (dir === null) {
                logger.warn(
                    `Could not determine direction for relation ${rel.id} ` +
                    `(${lineRef}: ${terminals.dir0Terminal} > ${terminals.dir1Terminal}): ` +
                    `from="${from}" to="${to}"`
                );
                continue;
            }

            const wayMembers = rel.members.filter(m => m.type === "way" && m.role === "");
            const points: [number, number][] = [];

            for (const member of wayMembers) {
                const way = ways.get(member.ref);
                if (!way?.nodes) continue;

                let coords = way.nodes
                    .map(id => nodes.get(id))
                    .filter(Boolean)
                    .map(n => [n!.lat, n!.lon] as [number, number]);

                if (!coords.length) continue;

                if (points.length === 0) {
                    // peek at the next way to orient the first way correctly
                    const nextIndex = wayMembers.indexOf(member) + 1;
                    const nextWay = nextIndex < wayMembers.length
                        ? ways.get(wayMembers[nextIndex].ref)
                        : null;

                    if (nextWay?.nodes) {
                        const nextCoords = nextWay.nodes
                            .map(id => nodes.get(id))
                            .filter(Boolean)
                            .map(n => [n!.lat, n!.lon] as [number, number]);

                        if (nextCoords.length) {
                            const nextFirst = nextCoords[0];
                            const nextLast  = nextCoords[nextCoords.length - 1];

                            // which end of the first way is closer to either end of the next way?
                            const startDist = Math.min(
                                Math.hypot(
                                    coords[0][0] - nextFirst[0],
                                    coords[0][1] - nextFirst[1]
                                ),
                                Math.hypot(
                                    coords[0][0] - nextLast[0],
                                    coords[0][1] - nextLast[1]
                                )
                            );
                            const endDist = Math.min(
                                Math.hypot(
                                    coords[coords.length-1][0] - nextFirst[0],
                                    coords[coords.length-1][1] - nextFirst[1]
                                ),
                                Math.hypot(
                                    coords[coords.length-1][0] - nextLast[0],
                                     coords[coords.length-1][1] - nextLast[1]
                                )
                            );

                            // if our start connects better than our end, reverse so our end faces the chain
                            if (startDist < endDist) coords = coords.reverse();
                        }
                    }

                    points.push(...coords);
                    continue;
                }

                const last = points[points.length - 1];
                const distToFirst = Math.hypot(coords[0][0] - last[0], coords[0][1] - last[1]);
                const distToLast  = Math.hypot(
                    coords[coords.length - 1][0] - last[0],
                    coords[coords.length - 1][1] - last[1]
                );

                if (distToLast < distToFirst) coords = coords.reverse();

                points.push(...coords.slice(1));
            }

            if (points.length) {
                shapes.set(`${lineRef}_${dir}`, points);
            }
        }

        return shapes;
    }


    // utils

    private normalizeTerminalName = (s: string): string => {
        return s
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // strip diacritics
            .toLowerCase()
            .replace(/\(terminus\)/gi, " terminus") // "(Terminus)" → "terminus"
            .replace(/terminus\s+arriv[eé]e?/gi, "terminus") // "Terminus Arrivée" → "terminus"
            .replace(/\s+/g, " ")
            .replace(/\bal\b/gi, "el") // OSM returns e.g. "Hay Al Wahda" instead of "Hay El Wahda"
            .trim();
    }

    private coreTerminalName = (normalized: string): string => {
        return normalized
            .replace(/\bterminusb\b/gi, "") // won't match, use below
            .replace(/\bterminus\b/gi, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    private terminalMatch = (osmValue: string, apiTerminal: string): boolean => {
        const normOsm = this.normalizeTerminalName(osmValue);
        const normApi = this.normalizeTerminalName(apiTerminal);

        if (normOsm === normApi) return true;

        const coreOsm = this.coreTerminalName(normOsm);
        const coreApi = this.coreTerminalName(normApi);

        // match after stripping "terminus" from both
        if (coreOsm === coreApi) return true;

        // one contains the other's core (handles intermediate stop cases like BW1)
        if (coreOsm.includes(coreApi) || coreApi.includes(coreOsm)) return true;

        return false;
    }
}
