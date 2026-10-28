import { assertEquals } from "@std/assert";
import { dropOppositeDirectionTrips, interpolateStopOffsets, secondsToTime } from "@utils/utils.ts";

Deno.test("terminus ghost of a trip is dropped from the opposite direction", () => {
    const e = (tripId: string, stopId: string) => ({ tripId, stopId });
    const result = dropOppositeDirectionTrips({
        0: [e("A", "casa-port"), e("A", "far"), e("A", "airport"), e("B", "airport")],
        1: [e("A", "airport"), e("A", "casa-port"), e("B", "airport"), e("B", "far"), e("B", "casa-port")]
    });

    assertEquals(result[0].map(x => x.tripId), ["A", "A", "A"]);
    assertEquals(result[1].map(x => x.tripId), ["B", "B", "B"]);
});

Deno.test("stop offsets follow distance and end at the measured duration", () => {
    // three stops on a line of longitude, 1 km then 2 km apart
    const offsets = interpolateStopOffsets([[33.0, -7.6], [33.009, -7.6], [33.027, -7.6]], 3000);

    assertEquals(offsets[0], 0);
    assertEquals(offsets[1], 1000);
    assertEquals(offsets[2], 3000);
});

Deno.test("seconds format as GTFS time past midnight", () => {
    assertEquals(secondsToTime(5 * 3600 + 77 * 60 + 20), "06:17:20");
    assertEquals(secondsToTime(25 * 3600), "25:00:00");
});
