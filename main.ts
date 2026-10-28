import CasaBusGTFS from "@src/CasaBusGTFS.ts";
import CasaTramwayGTFS from "@src/CasaTramwayGTFS.ts";
import { mergeFeeds } from "@src/mergeFeeds.ts";

if (import.meta?.main) {
    const busGtfs = new CasaBusGTFS();
    const tramGtfs = new CasaTramwayGTFS();

    const busBundle = await busGtfs.exportGTFSToDirectory("./gtfs-bus");
    const tramBundle = await tramGtfs.exportGTFSToDirectory("./gtfs-tramway");

    const merged = mergeFeeds({ tram: tramBundle, bus: busBundle }, "tram");
    await Deno.mkdir("./gtfs-casablanca", { recursive: true });
    for (const [fileName, content] of Object.entries(merged)) {
        await Deno.writeTextFile(`./gtfs-casablanca/${fileName}`, content!);
    }

    // const shapesIDs = await busGtfs.getShapesIDs();

    // console.log((await busGtfs.getTimetable("43", "0:TERMINUS DOHA_")).data)

    // await Deno.writeTextFile("./gtfs/trips.txt", await tramGtfs.getGTFSTrips())
    // await Deno.writeTextFile("./gtfs/shapes.txt", await tramGtfs.getGTFSShapes())

    // await tramGtfs.exportGTFSToDirectory("./gtfs-tramway");
    // await Deno.writeTextFile("./gtfs/frequencies.txt", await tramGtfs.getGTFSFrequencies());
    // console.log(await tramGtfs.getOrderedStops("BW1", 0));

    // let data = await tramGtfs.getOrderedStops("T1", 1);
    // console.log(data[0].StopName.value);
    // console.log(data[1].StopName.value);
    // console.log(data[2].StopName.value);
    // console.log(data[4].StopName.value);
    // console.log("...")
    // console.log(data[data.length - 4].StopName.value);
    // console.log(data[data.length - 3].StopName.value);
    // console.log(data[data.length - 2].StopName.value);
    // console.log(data[data.length - 1].StopName.value);

    // await Deno.writeTextFile("./gtfs-bus/trips.txt", await busGtfs.exportLogWrapper("trips.txt", busGtfs.getGTFSTrips, ""));
    // let data1 = (await busGtfs.getRouteDetails("97", 0)).data!;
    // let data2 = (await busGtfs.getRouteDetails("97", 1)).data!;
    // console.log(await busGtfs.getCalendarPerimeter())
}
