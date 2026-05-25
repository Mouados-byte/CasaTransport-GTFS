export interface OverpassNode {
    type: "node";
    id: number;
    lat: number;
    lon: number;
}

export interface OverpassWay {
    type: "way";
    id: number;
    nodes: number[];
    tags?: Record<string, string>;
}

export interface OverpassRelation {
    type: "relation";
    id: number;
    tags?: {
        ref?: string;
        name?: string;
        route?: string; 
        network?: string;
        type?: string;
        from?: string;
        to?: string;
    };
    members: Array<{
        type: "node" | "way" | "relation";
        ref: number;
        role: "main" | "stop" | "platform" | "forward" | "backward" | "";
    }>;
}

export interface OverpassResponse {
    version: number;
    generator: string;
    osm3s: {
        timestamp_osm_base: string;
        copyright: string;
    };
    elements: (OverpassNode | OverpassWay | OverpassRelation)[];
}
