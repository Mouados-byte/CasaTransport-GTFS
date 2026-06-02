import { WebpackStopPoint } from "@proto/types.ts";
import { BasicLine, LineDest } from "./line.ts";
import { LineName, StopPoint } from "./types.ts";
// import { LightLine } from "./line.ts";
// import { Coordinates } from "./types.ts";


// /proto/stoppoints-discovery(-all)
// export default class ProtoStop {
//     spoints!: ProtoStop[]; // not sure of type
//     lines!: LightLine[];
//     name!: string;
//     ref!: string;
//     city!: string;
//     location!: Coordinates;
// }

export const StopPointFromWebpack = <T extends boolean>(spw: WebpackStopPoint): StopPoint<T> => ({
    StopName: { value: spw.name ?? "" },
    HandAccess: false,
    Lines: (spw.lines || []).reduce((acc, ref) => ({
        ...acc,
        [<LineName>ref]: {
            LineRef: ref, LongName: "", ShortName: ref, Dests: [] as LineDest[]
        }
    }), {} as { [key in LineName]: BasicLine }),
    Location: {
        Latitude: String(spw.x || 0),
        Longitude: String(spw.y || 0),
    },
    StopCity: spw.city || "",
    StopPointRef: spw.ref || "",
    StopStreet: "",
    StopStreetNumber: ""
})
