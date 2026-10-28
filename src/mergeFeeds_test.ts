import { assertEquals } from "@std/assert";
import { parse } from "@std/csv";
import { mergeFeeds } from "@src/mergeFeeds.ts";

const rows = (csv: string) => parse(csv, { skipFirstRow: true }) as Record<string, string>[];

Deno.test("merged feed prefixes ids, groups same-name stops and links tram to nearby bus stops", () => {
    const merged = mergeFeeds({
        tram: {
            "stops.txt": "stop_id,stop_name,stop_lat,stop_lon\n" +
                "1,Place Mohammed V,33.592000,-7.616000\n" +
                "2,Place Mohammed V,33.592300,-7.616000\n", // ~33 m away: same station
            "feed_info.txt": "feed_publisher_name,feed_start_date,feed_end_date\nx,20260601,20260630\n"
        },
        bus: {
            "stops.txt": "stop_id,stop_name,stop_lat,stop_lon\n" +
                "1,Hassan II,33.593000,-7.616000\n" + // ~111 m from tram 1: transfer
                "2,Ain Diab,33.600000,-7.680000\n",   // far away: no transfer
            "feed_info.txt": "feed_publisher_name,feed_start_date,feed_end_date\nx,20260508,20260629\n"
        }
    }, "tram");

    const stops = rows(merged["stops.txt"]);
    assertEquals(stops.filter(s => s.parent_station === "station:1").map(s => s.stop_id), ["tram:1", "tram:2"]);
    assertEquals(stops.find(s => s.stop_id === "station:1")?.location_type, "1");

    const transfers = rows(merged["transfers.txt"]!).map(t => `${t.from_stop_id}>${t.to_stop_id}`);
    assertEquals(transfers.includes("tram:1>bus:1") && transfers.includes("bus:1>tram:1"), true);
    assertEquals(transfers.some(t => t.includes("bus:2")), false);

    const info = rows(merged["feed_info.txt"])[0];
    assertEquals([info.feed_start_date, info.feed_end_date], ["20260508", "20260630"]);
});
