import CasaTramwayGTFS from "./src/CasaTramwayGTFS.ts";

if (import.meta?.main) {
    const tramGtfs = new CasaTramwayGTFS();

    // await Deno.writeTextFile("./gtfs/trips.txt", await tramGtfs.getGTFSTrips())
    // await Deno.writeTextFile("./gtfs/shapes.txt", await tramGtfs.getGTFSShapes())

    await tramGtfs.exportGTFSToDirectory("./gtfs");
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
}
