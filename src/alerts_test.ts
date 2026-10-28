import { assertEquals } from "@std/assert";
import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import { incidentsToAlerts } from "@src/alerts.ts";

Deno.test("incidents become decodable service alerts on the prefixed route", () => {
    const bytes = incidentsToAlerts([{
        // shape of a live response, 2026-10-28
        id: "96baf98d3b4a457699819f2ff5adaed0",
        title: "Perturbation sur: ",
        text: "TERMINUS PROVISOIR COMMISARIAT NASSIM",
        route: "L009E",
        routeId: "L009E",
        duration: "739916 J 17 H 56 min",
        blockCreationTime: "0001-01-01T00:00:00",
        dateDebut: "2026-07-08T10:00:00",
        dateFin: "0001-01-01T00:00:00"
    }], "bus:");

    const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(bytes);
    const alert = feed.entity[0].alert!;

    assertEquals(alert.informedEntity![0].routeId, "bus:L09E");
    assertEquals(alert.headerText!.translation![0].text, "Perturbation sur: TERMINUS PROVISOIR COMMISARIAT NASSIM");
    assertEquals(Number(alert.activePeriod![0].start), Date.parse("2026-07-08T09:00:00Z") / 1000);
    assertEquals(Number(alert.activePeriod![0].end), 0);
});
