// @deno-types="./orchestraProto.d.ts"
import { proto } from "./orchestraProto.js";

export type ProtoClasses = {
    // deno-lint-ignore no-explicit-any
    [K in keyof typeof proto]: typeof proto[K] extends abstract new (...args: any) => infer I 
        ? I
        : never
}[keyof typeof proto];

export type ProtoClassConstructor<T extends ProtoClasses> = {
    // deno-lint-ignore no-explicit-any
    [K in keyof typeof proto]: typeof proto[K] extends abstract new (...args: any) => infer I
        ? T extends I ? typeof proto[K] : never
        : never
}[keyof typeof proto];

interface Dest {
    id: string;
    name: string;
    service: string; // => Line.ref
}

export interface WebpackStopPoint {
    name?: string;
    x?: number;
    y?: number;
    ref?: string;
    city?: string;
    stopId?: string;
    lines?: string[];
    dests?: Dest[];

    isCommercial?: boolean;
    isCurrent?: boolean;
    spoints?: WebpackStopPoint[];
}


export const ProtoStopFromStopPoint = (sp: proto.IStopPoint): proto.Stop => {
    return proto.Stop.create({
        city: sp.city,
        name: sp.id,
        ref: sp.id,
        location: {
            latitude: sp.latitude,
            longitude: sp.longitude,
        },
        spoints: [],
        lines: []
    });
}
