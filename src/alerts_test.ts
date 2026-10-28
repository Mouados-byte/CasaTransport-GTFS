import { assertEquals } from "@std/assert";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { incidentsToAlerts } from "@src/alerts.ts";

Deno.test("incidents become decodable service alerts on the prefixed route", () => {
    const bytes = incidentsToAlerts([{
        id: "42",
        title: "Deviation L007",
        text: "Travaux boulevard Zerktouni",
        route: "L007",
        routeId: "L007",
        duration: "",
        blockCreationTime: "",
        dateDebut: "2026-10-28T08:00:00Z",
        dateFin: "not a date"
    }], "bus:");

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(bytes);
    const alert = feed.entity[0].alert!;

    assertEquals(alert.informedEntity![0].routeId, "bus:L007");
    assertEquals(alert.headerText!.translation![0].text, "Deviation L007");
    assertEquals(Number(alert.activePeriod![0].start), Date.parse("2026-10-28T08:00:00Z") / 1000);
    assertEquals(Number(alert.activePeriod![0].end), 0);
});
