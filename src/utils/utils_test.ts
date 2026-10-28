import { assertEquals } from "@std/assert";
import { dropOppositeDirectionTrips } from "@utils/utils.ts";

Deno.test("terminus ghost of a trip is dropped from the opposite direction", () => {
    const e = (tripId: string, stopId: string) => ({ tripId, stopId });
    const result = dropOppositeDirectionTrips({
        0: [e("A", "casa-port"), e("A", "far"), e("A", "airport"), e("B", "airport")],
        1: [e("A", "airport"), e("A", "casa-port"), e("B", "airport"), e("B", "far"), e("B", "casa-port")]
    });

    assertEquals(result[0].map(x => x.tripId), ["A", "A", "A"]);
    assertEquals(result[1].map(x => x.tripId), ["B", "B", "B"]);
});
