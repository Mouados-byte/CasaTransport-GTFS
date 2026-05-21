// deno-lint-ignore-file no-explicit-any

// auto-generated; npx jsdoc -t $NODE/node_modules/tsd-jsdoc/dist orchestraProto.js 

import type * as $protobuf from "protobufjs/minimal";

/**
 * Namespace proto.
 */
export declare namespace proto {
    /**
     * Properties of an Infos.
     * @property [pageCurrent] - Infos pageCurrent
     * @property [pagePrev] - Infos pagePrev
     * @property [pageNext] - Infos pageNext
     * @property [pageLast] - Infos pageLast
     * @property [pageItemsNb] - Infos pageItemsNb
     * @property [totalItems] - Infos totalItems
     * @property [resultsDateTime] - Infos resultsDateTime
     */
    interface IInfos {
        pageCurrent: number;
        pagePrev: number;
        pageNext: number;
        pageLast: number;
        pageItemsNb: number;
        totalItems: number;
        resultsDateTime: string;
    }

    /**
     * Constructs a new Infos.
     * @param [properties] - Properties to set
     */
    class Infos implements IInfos {
        constructor(properties?: proto.IInfos);
        /**
         * Infos pageCurrent.
         */
        pageCurrent: number;
        /**
         * Infos pagePrev.
         */
        pagePrev: number;
        /**
         * Infos pageNext.
         */
        pageNext: number;
        /**
         * Infos pageLast.
         */
        pageLast: number;
        /**
         * Infos pageItemsNb.
         */
        pageItemsNb: number;
        /**
         * Infos totalItems.
         */
        totalItems: number;
        /**
         * Infos resultsDateTime.
         */
        resultsDateTime: string;
        /**
         * Creates a new Infos instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns Infos instance
         */
        static create(properties?: proto.IInfos): proto.Infos;
        /**
         * Encodes the specified Infos message. Does not implicitly {@link proto.Infos.verify|verify} messages.
         * @param message - Infos message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.IInfos, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified Infos message, length delimited. Does not implicitly {@link proto.Infos.verify|verify} messages.
         * @param message - Infos message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.IInfos, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes an Infos message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns Infos
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Infos;
        /**
         * Decodes an Infos message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns Infos
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Infos;
        /**
         * Verifies an Infos message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates an Infos message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns Infos
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.Infos;
        /**
         * Creates a plain object from an Infos message. Also converts values to other types if specified.
         * @param message - Infos
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.Infos, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this Infos to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for Infos
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a LinesApiResponse.
     * @property [infos] - LinesApiResponse infos
     * @property [lines] - LinesApiResponse lines
     */
    interface ILinesApiResponse {
        infos?: proto.IInfos | null;
        lines: proto.ILine[];
    }

    /**
     * Constructs a new LinesApiResponse.
     * @param [properties] - Properties to set
     */
    class LinesApiResponse implements ILinesApiResponse {
        constructor(properties?: proto.ILinesApiResponse);
        /**
         * LinesApiResponse infos.
         */
        infos: proto.IInfos | null | undefined;
        /**
         * LinesApiResponse lines.
         */
        lines: proto.ILine[];
        /**
         * Creates a new LinesApiResponse instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns LinesApiResponse instance
         */
        static create(properties?: proto.ILinesApiResponse): proto.LinesApiResponse;
        /**
         * Encodes the specified LinesApiResponse message. Does not implicitly {@link proto.LinesApiResponse.verify|verify} messages.
         * @param message - LinesApiResponse message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.ILinesApiResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified LinesApiResponse message, length delimited. Does not implicitly {@link proto.LinesApiResponse.verify|verify} messages.
         * @param message - LinesApiResponse message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.ILinesApiResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a LinesApiResponse message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns LinesApiResponse
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.LinesApiResponse;
        /**
         * Decodes a LinesApiResponse message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns LinesApiResponse
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.LinesApiResponse;
        /**
         * Verifies a LinesApiResponse message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a LinesApiResponse message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns LinesApiResponse
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.LinesApiResponse;
        /**
         * Creates a plain object from a LinesApiResponse message. Also converts values to other types if specified.
         * @param message - LinesApiResponse
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.LinesApiResponse, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this LinesApiResponse to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for LinesApiResponse
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a Line.
     * @property [ref] - Line ref
     * @property [longname] - Line longname
     * @property [shortname] - Line shortname
     * @property [color] - Line color
     * @property [colortext] - Line colortext
     * @property [type] - Line type
     * @property [order] - Line order
     * @property [categ] - Line categ
     */
    interface ILine {
        ref: string;
        longname: string;
        shortname: string;
        color: string;
        colortext: string;
        type: number;
        order: number;
        categ: string;
    }

    /**
     * Constructs a new Line.
     * @param [properties] - Properties to set
     */
    class Line implements ILine {
        constructor(properties?: proto.ILine);
        /**
         * Line ref.
         */
        ref: string;
        /**
         * Line longname.
         */
        longname: string;
        /**
         * Line shortname.
         */
        shortname: string;
        /**
         * Line color.
         */
        color: string;
        /**
         * Line colortext.
         */
        colortext: string;
        /**
         * Line type.
         */
        type: number;
        /**
         * Line order.
         */
        order: number;
        /**
         * Line categ.
         */
        categ: string;
        /**
         * Creates a new Line instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns Line instance
         */
        static create(properties?: proto.ILine): proto.Line;
        /**
         * Encodes the specified Line message. Does not implicitly {@link proto.Line.verify|verify} messages.
         * @param message - Line message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.ILine, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified Line message, length delimited. Does not implicitly {@link proto.Line.verify|verify} messages.
         * @param message - Line message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.ILine, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a Line message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns Line
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Line;
        /**
         * Decodes a Line message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns Line
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Line;
        /**
         * Verifies a Line message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a Line message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns Line
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.Line;
        /**
         * Creates a plain object from a Line message. Also converts values to other types if specified.
         * @param message - Line
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.Line, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this Line to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for Line
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a StopsApiResponse.
     * @property [infos] - StopsApiResponse infos
     * @property [stops] - StopsApiResponse stops
     */
    interface IStopsApiResponse {
        infos?: proto.IInfos | null;
        stops: proto.IStop[];
    }

    /**
     * Constructs a new StopsApiResponse.
     * @param [properties] - Properties to set
     */
    class StopsApiResponse implements IStopsApiResponse {
        constructor(properties?: proto.IStopsApiResponse);
        /**
         * StopsApiResponse infos.
         */
        infos: proto.IInfos | null | undefined;
        /**
         * StopsApiResponse stops.
         */
        stops: proto.IStop[];
        /**
         * Creates a new StopsApiResponse instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns StopsApiResponse instance
         */
        static create(properties?: proto.IStopsApiResponse): proto.StopsApiResponse;
        /**
         * Encodes the specified StopsApiResponse message. Does not implicitly {@link proto.StopsApiResponse.verify|verify} messages.
         * @param message - StopsApiResponse message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.IStopsApiResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified StopsApiResponse message, length delimited. Does not implicitly {@link proto.StopsApiResponse.verify|verify} messages.
         * @param message - StopsApiResponse message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.IStopsApiResponse, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a StopsApiResponse message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns StopsApiResponse
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.StopsApiResponse;
        /**
         * Decodes a StopsApiResponse message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns StopsApiResponse
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.StopsApiResponse;
        /**
         * Verifies a StopsApiResponse message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a StopsApiResponse message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns StopsApiResponse
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.StopsApiResponse;
        /**
         * Creates a plain object from a StopsApiResponse message. Also converts values to other types if specified.
         * @param message - StopsApiResponse
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.StopsApiResponse, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this StopsApiResponse to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for StopsApiResponse
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a Stop.
     * @property [name] - Stop name
     * @property [ref] - Stop ref
     * @property [city] - Stop city
     * @property [location] - Stop location
     * @property [spoints] - Stop spoints
     * @property [lines] - Stop lines
     */
    interface IStop {
        name: string;
        ref: string;
        city: string;
        location?: proto.ILocation | null;
        spoints: proto.IStopPoint[];
        lines: proto.ILightLine[];
    }

    /**
     * Constructs a new Stop.
     * @param [properties] - Properties to set
     */
    class Stop implements IStop {
        constructor(properties?: proto.IStop);
        /**
         * Stop name.
         */
        name: string;
        /**
         * Stop ref.
         */
        ref: string;
        /**
         * Stop city.
         */
        city: string;
        /**
         * Stop location.
         */
        location: proto.ILocation | null | undefined;
        /**
         * Stop spoints.
         */
        spoints: proto.IStopPoint[];
        /**
         * Stop lines.
         */
        lines: proto.ILightLine[];
        /**
         * Creates a new Stop instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns Stop instance
         */
        static create(properties?: proto.IStop): proto.Stop;
        /**
         * Encodes the specified Stop message. Does not implicitly {@link proto.Stop.verify|verify} messages.
         * @param message - Stop message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.IStop, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified Stop message, length delimited. Does not implicitly {@link proto.Stop.verify|verify} messages.
         * @param message - Stop message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.IStop, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a Stop message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns Stop
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Stop;
        /**
         * Decodes a Stop message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns Stop
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Stop;
        /**
         * Verifies a Stop message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a Stop message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns Stop
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.Stop;
        /**
         * Creates a plain object from a Stop message. Also converts values to other types if specified.
         * @param message - Stop
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.Stop, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this Stop to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for Stop
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a StopPoint.
     * @property [id] - StopPoint id
     * @property [city] - StopPoint city
     * @property [latitude] - StopPoint latitude
     * @property [longitude] - StopPoint longitude
     * @property [lines] - StopPoint lines
     */
    interface IStopPoint {
        id: string;
        city: string;
        latitude: number;
        longitude: number;
        lines: proto.ILightLine[];
    }

    /**
     * Constructs a new StopPoint.
     * @param [properties] - Properties to set
     */
    class StopPoint implements IStopPoint {
        constructor(properties?: proto.IStopPoint);
        /**
         * StopPoint id.
         */
        id: string;
        /**
         * StopPoint city.
         */
        city: string;
        /**
         * StopPoint latitude.
         */
        latitude: number;
        /**
         * StopPoint longitude.
         */
        longitude: number;
        /**
         * StopPoint lines.
         */
        lines: proto.ILightLine[];
        /**
         * Creates a new StopPoint instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns StopPoint instance
         */
        static create(properties?: proto.IStopPoint): proto.StopPoint;
        /**
         * Encodes the specified StopPoint message. Does not implicitly {@link proto.StopPoint.verify|verify} messages.
         * @param message - StopPoint message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.IStopPoint, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified StopPoint message, length delimited. Does not implicitly {@link proto.StopPoint.verify|verify} messages.
         * @param message - StopPoint message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.IStopPoint, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a StopPoint message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns StopPoint
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.StopPoint;
        /**
         * Decodes a StopPoint message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns StopPoint
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.StopPoint;
        /**
         * Verifies a StopPoint message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a StopPoint message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns StopPoint
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.StopPoint;
        /**
         * Creates a plain object from a StopPoint message. Also converts values to other types if specified.
         * @param message - StopPoint
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.StopPoint, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this StopPoint to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for StopPoint
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a LightLine.
     * @property [id] - LightLine id
     * @property [ref] - LightLine ref
     * @property [dests] - LightLine dests
     */
    interface ILightLine {
        id: string;
        ref: string;
        dests: proto.IDestination[];
    }

    // interface LightLine extends ILightLine {
    // }

    /**
     * Constructs a new LightLine.
     * @param [properties] - Properties to set
     */
    class LightLine implements ILightLine {
        constructor(properties?: proto.ILightLine);
        /**
         * LightLine id.
         */
        id: string;
        /**
         * LightLine ref.
         */
        ref: string;
        /**
         * LightLine dests.
         */
        dests: proto.IDestination[];
        /**
         * Creates a new LightLine instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns LightLine instance
         */
        static create(properties?: proto.ILightLine): proto.LightLine;
        /**
         * Encodes the specified LightLine message. Does not implicitly {@link proto.LightLine.verify|verify} messages.
         * @param message - LightLine message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.ILightLine, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified LightLine message, length delimited. Does not implicitly {@link proto.LightLine.verify|verify} messages.
         * @param message - LightLine message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.ILightLine, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a LightLine message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns LightLine
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.LightLine;
        /**
         * Decodes a LightLine message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns LightLine
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.LightLine;
        /**
         * Verifies a LightLine message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a LightLine message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns LightLine
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.LightLine;
        /**
         * Creates a plain object from a LightLine message. Also converts values to other types if specified.
         * @param message - LightLine
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.LightLine, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this LightLine to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for LightLine
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a Destination.
     * @property [lib] - Destination lib
     */
    interface IDestination {
        lib: string;
    }

    // interface Destination extends IDestination {
    // }
    /**
     * Constructs a new Destination.
     * @param [properties] - Properties to set
     */
    class Destination implements IDestination {
        constructor(properties?: proto.IDestination);
        /**
         * Destination lib.
         */
        lib: string;
        /**
         * Creates a new Destination instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns Destination instance
         */
        static create(properties?: proto.IDestination): proto.Destination;
        /**
         * Encodes the specified Destination message. Does not implicitly {@link proto.Destination.verify|verify} messages.
         * @param message - Destination message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.IDestination, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified Destination message, length delimited. Does not implicitly {@link proto.Destination.verify|verify} messages.
         * @param message - Destination message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.IDestination, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a Destination message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns Destination
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Destination;
        /**
         * Decodes a Destination message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns Destination
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Destination;
        /**
         * Verifies a Destination message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a Destination message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns Destination
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.Destination;
        /**
         * Creates a plain object from a Destination message. Also converts values to other types if specified.
         * @param message - Destination
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.Destination, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this Destination to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for Destination
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }


    /**
     * Properties of a Location.
     * @property [latitude] - Location latitude
     * @property [longitude] - Location longitude
     */
    interface ILocation {
        latitude: number;
        longitude: number;
    }

    // interface Location extends ILocation {
    // }
    /**
     * Constructs a new Location.
     * @param [properties] - Properties to set
     */
    class Location implements ILocation {
        constructor(properties?: proto.ILocation);
        /**
         * Location latitude.
         */
        latitude: number;
        /**
         * Location longitude.
         */
        longitude: number;
        /**
         * Creates a new Location instance using the specified properties.
         * @param [properties] - Properties to set
         * @returns Location instance
         */
        static create(properties?: proto.ILocation): proto.Location;
        /**
         * Encodes the specified Location message. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @param message - Location message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encode(message: proto.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Encodes the specified Location message, length delimited. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @param message - Location message or plain object to encode
         * @param [writer] - Writer to encode to
         * @returns Writer
         */
        static encodeDelimited(message: proto.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;
        /**
         * Decodes a Location message from the specified reader or buffer.
         * @param reader - Reader or buffer to decode from
         * @param [length] - Message length if known beforehand
         * @returns Location
         */
        static decode(reader: $protobuf.Reader | Uint8Array, length?: number): proto.Location;
        /**
         * Decodes a Location message from the specified reader or buffer, length delimited.
         * @param reader - Reader or buffer to decode from
         * @returns Location
         */
        static decodeDelimited(reader: $protobuf.Reader | Uint8Array): proto.Location;
        /**
         * Verifies a Location message.
         * @param message - Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        static verify(message: {
            [key: string]: any;
        }): string | null;
        /**
         * Creates a Location message from a plain object. Also converts values to their respective internal types.
         * @param object - Plain object
         * @returns Location
         */
        static fromObject(object: {
            [key: string]: any;
        }): proto.Location;
        /**
         * Creates a plain object from a Location message. Also converts values to other types if specified.
         * @param message - Location
         * @param [options] - Conversion options
         * @returns Plain object
         */
        static toObject(message: proto.Location, options?: $protobuf.IConversionOptions): {
            [key: string]: any;
        };
        /**
         * Converts this Location to JSON.
         * @returns JSON object
         */
        toJSON(): {
            [key: string]: any;
        };
        /**
         * Gets the default type url for Location
         * @param [typeUrlPrefix] - your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
