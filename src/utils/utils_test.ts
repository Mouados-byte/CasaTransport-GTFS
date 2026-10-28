import { assertEquals } from "@std/assert";
import { dropOppositeDirectionTrips, interpolateStopOffsets, parsePublicHolidays, secondsToTime } from "@utils/utils.ts";

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

Deno.test("public holidays come from Jour férié events of the year only", () => {
    // folded DESCRIPTION line and CRLF endings, as Google serves them
    const ics = [
        "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20260320", "SUMMARY:Aïd al-Fitr", "DESCRIPTION:Jour férié", "END:VEVENT",
        "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20260219", "SUMMARY:Ramadan", "DESCRIPTION:Journée d'observance\\nPour", " masquer", "END:VEVENT",
        "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20251118", "SUMMARY:Fête de l'indépendance", "DESCRIPTION:Jour férié", "END:VEVENT",
        "BEGIN:VEVENT", "DTSTART;VALUE=DATE:20260101", "SUMMARY:Jour de l'an", "DESCRIPTION:Jour férié", "END:VEVENT"
    ].join("\r\n");

    assertEquals(parsePublicHolidays(ics, 2026), ["20260101", "20260320"]);
});
