import {
    TransportMode, TransportCategory, LineNumber,
    AgencyType, BooleanString, TransportType,
    IScheduleStopTime, LineName,
    boolStrToBool,
} from "./types.ts";

// some types taken from casatramway.ma

export interface ApiColors {
    name: string;
    bgcolor: string;
    color: string;
}

export interface ColorsDict {
    [key: string]: ApiColors;
}

// /proto/lines-discovery-all
export class ProtoLine {
    ref?: string;
    order?: number = 0;
    name?: string;
    mnemo?: string;
    color?: string;
    colorText?: string;
    lineType?: number;
    categ?: string = "";
    mode?: TransportMode;
    colors?: ApiColors;
    refs: string[];
    agencyRef?: string;
    agencyName?: string;

    constructor(
        ref: string,
        name: string,
        mnemo: string,
        color: string,
        colorText: string,
        lineType: number,
        order?: number,
        categ?: string,
        agencyRef?: string,
        agencyName?: string
    );

    constructor(obj: object);

    constructor(
        ...args: [string, string, string, string, string, number, number?, string?, string?, string?] | [object]
    ) {
        if (args.length === 1 && typeof args[0] === "object") {
            const obj = args[0] as { [key: string]: string | number | undefined };
            this.ref = obj.ref as string;
            this.name = obj.name as string;
            this.mnemo = obj.mnemo as string;
            this.color = obj.color as string;
            this.colorText = obj.colorText as string;
            this.lineType = obj.lineType as number;
            this.categ = (obj.categ as string) || "";
            this.order = (obj.order as number) || 0;
            this.agencyRef = obj.agencyRef as string | undefined;
            this.agencyName = obj.agencyName as string | undefined;
        } else if (args.length >= 6) {
            const [
                ref, name, mnemo, color,
                colorText, lineType, order = 0,
                categ = "", agencyRef, agencyName
            ] = args as [string, string, string, string, string, number, number?, string?, string?, string?];

            this.ref = ref;
            this.name = name;
            this.mnemo = mnemo;
            this.lineType = lineType;
            this.categ = categ;
            this.order = order;
            this.color = color;
            this.colorText = colorText;
            this.agencyRef = agencyRef;
            this.agencyName = agencyName;
        }

        this.refs = [];
        this.setColors();
        this.mode = this.getTransportMode();
    }

    private setColors() {
        if (this.color && this.colorText) {
            const apiColors: ApiColors = {
                name: this.mnemo || "",
                bgcolor: `#${this.color}`,
                color: `#${this.colorText}`
            };
            this.colors = this.getLineColor([], this.mnemo || "", apiColors);
            return;
        }

        this.colors = this.getLineColor([], this.mnemo || "");
    }

    private getLineColor(
        linesColors: string[],
        line: string,
        apiColors?: ApiColors
    ): ApiColors {
        const colors: ColorsDict = {};
        for (const lineColor of linesColors) {
            if (!lineColor) {
                continue;
            }
            const parts = lineColor.split("::");
            const name = parts[0];
            const bgcolor = parts[1];
            const color = parts[2];
            colors[name] = { name, bgcolor, color };
        }

        if (colors[line]) {
            return colors[line];
        }

        if (apiColors) {
            colors[apiColors.name] = apiColors;
            return apiColors;
        }

        return {
            name: line,
            bgcolor: "#0074bd",
            color: "#000"
        };
    }

    private getTransportMode(): TransportMode {
        switch (this.lineType) {
            case 0: return TransportMode.TRAM;
            case 1: return TransportMode.SUBWAY;
            case 2: return TransportMode.RAIL;
            case 3: return TransportMode.BUS;
            case 4: return TransportMode.FERRY;
            case 5: return TransportMode.CABLECAR;
            case 6: return TransportMode.GONDOLA;
            case 7: return TransportMode.FUNICULAR;
            default: return TransportMode.BUS;
        }
    }
}


export interface ILineWithStopTimes {
    ShortName: string;
    LongName: string;
    Order: string;
    Type: string;
    Picto: string;
    PictoLine: string;
    School: string;
    Categ: `${TransportCategory}`;
    Color: string;
    ColorText: string;
    RouteId: LineName;
    Schedule: IScheduleStopTime[];
    Direction: "0" | "1";
    DirLib: string;
    DirTexte: string;
    DirLabel: string;
}

export default class Line {
    shortName!: string;
    longName!: string;
    order!: number;
    type!: TransportType;
    picto!: string;
    pictoLine!: string;
    school!: string;
    category!: TransportCategory;
    color!: string;
    colorText!: string;
    lineRef!: LineNumber;
    creationDate!: string;
    agencyName!: AgencyType;
    TAD!: boolean;
    wheelchairAccessible!: boolean;
    destinations!: {
        destinationRef: string;
        destinationDir: 0 | 1;
    }[];
    areas!: unknown[];
    agencyRef!: number;

    constructor(
        shortName: string,
        longName: string,
        order: string,
        type: string,
        picto: string,
        pictoLine: string,
        school: string,
        categ: TransportCategory,
        color: string,
        colorText: string,
        lineRef: LineNumber,
        creationDate: string,
        agencyName: AgencyType,
        tad: BooleanString,
        wheelchairAccessible: BooleanString,
        destinations: {
            DestinationRef: string;
            DestinationDir: string;
        }[],
        areas: unknown[],
        agencyRef: string
    );

    constructor(obj: object);

    constructor(
        ...args: [
            string, string, string, string, string, string, string,
            TransportCategory, string, string, LineNumber,
            string, AgencyType, BooleanString, BooleanString,
            { DestinationRef: string; DestinationDir: string }[],
            unknown[], string
        ] | [object]
    ) {
        if (args.length === 1 && typeof args[0] === "object") {
            const { 
                ShortName, LongName, Order, Type, Picto, PictoLine,
                School, Categ, Color, ColorText, LineRef, CreationDate,
                AgencyName, TAD, WheelchairAccessible, Destinations,
                areas, AgencyRef
            } = args[0] as {
                [key: string]: string | { DestinationRef: string; DestinationDir: string }[] | unknown[]
            };

            this.shortName = ShortName as string;
            this.longName = LongName as string;
            this.order = parseInt(Order as string, 10);
            this.type = parseInt(Type as string, 10) as TransportType;
            this.picto = Picto as string;
            this.pictoLine = PictoLine as string;
            this.school = School as string;
            this.category = Categ as TransportCategory;
            this.color = Color as string;
            this.colorText = ColorText as string;
            this.lineRef = LineRef as LineNumber;
            this.creationDate = CreationDate as string;
            this.agencyName = AgencyName as AgencyType;
            this.TAD = boolStrToBool(TAD as BooleanString);
            this.wheelchairAccessible = boolStrToBool(WheelchairAccessible as BooleanString);
            this.destinations = (Destinations as { DestinationRef: string; DestinationDir: string }[])
                .map(this.destinationMapper);
            this.areas = areas as unknown[];
            this.agencyRef = parseInt(AgencyRef as string, 10);
        } else if (args.length >= 17) {
            const [
                shortName, longName, order, type, picto,
                pictoLine, school, categ, color, colorText,
                lineRef, creationDate, agencyName, tad,
                wheelchairAccessible, destinations, areas, agencyRef
            ] = args as [
                string, string, string, string, string, string, string,
                TransportCategory, string, string, LineNumber,
                string, AgencyType, BooleanString, BooleanString,
                { DestinationRef: string; DestinationDir: string }[],
                unknown[], string
            ];

            this.shortName = shortName;
            this.longName = longName;
            this.order = parseInt(order, 10);
            this.type = parseInt(type, 10) as TransportType;
            this.picto = picto;
            this.pictoLine = pictoLine;
            this.school = school;
            this.category = categ;
            this.color = color;
            this.colorText = colorText;
            this.lineRef = lineRef;
            this.creationDate = creationDate;
            this.agencyName = agencyName;
            this.TAD = boolStrToBool(tad);
            this.wheelchairAccessible = boolStrToBool(wheelchairAccessible);
            this.destinations = destinations.map(this.destinationMapper);
            this.areas = areas;
            this.agencyRef = parseInt(agencyRef, 10);
        }
    }

    private destinationMapper(dest: { DestinationRef: string; DestinationDir: string }): {
        destinationRef: string; destinationDir: 0 | 1
    } {
        return {
            destinationRef: dest.DestinationRef,
            destinationDir: parseInt(dest.DestinationDir, 10) as 0 | 1
        }
    }
}

export interface LineDest {
    direction: 0 | 1;
    lib: string;
    texte: string;
}

export interface BasicLine {
    LineRef: string;
    LongName: string;
    ShortName: string;
    Dests: [LineDest, LineDest] | [LineDest];
}

// used in StopProto
export interface LightLine {
    dests: { lib: string }[];
    id: string;
    ref: string;
}
