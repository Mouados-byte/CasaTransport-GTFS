/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/

// source: https://www.casatramway.ma/modules/ratpdev/atix_pthv/libraries/pthv_components/schedule/ApthSchedule.umd.min.js?teia1a (webpack://ApthSchedule/src/lib/orchestraProto.js)
// All credit goes to Casatramway.ma, RATP Dev and maintainers

// import * as $protobuf from "protobufjs/minimal.js";
import $protobuf from "protobufjs/minimal.js";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots?.["default"] || ($protobuf.roots["default"] = {});

export const proto = $root.proto = (() => {

    /**
     * Namespace proto.
     * @exports proto
     * @namespace
     */
    const proto = {};

    proto.Infos = (function() {

        /**
         * Properties of an Infos.
         * @memberof proto
         * @interface IInfos
         * @property {number|null} [pageCurrent] Infos pageCurrent
         * @property {number|null} [pagePrev] Infos pagePrev
         * @property {number|null} [pageNext] Infos pageNext
         * @property {number|null} [pageLast] Infos pageLast
         * @property {number|null} [pageItemsNb] Infos pageItemsNb
         * @property {number|null} [totalItems] Infos totalItems
         * @property {string|null} [resultsDateTime] Infos resultsDateTime
         */

        /**
         * Constructs a new Infos.
         * @memberof proto
         * @classdesc Represents an Infos.
         * @implements IInfos
         * @constructor
         * @param {proto.IInfos=} [properties] Properties to set
         */
        function Infos(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Infos pageCurrent.
         * @member {number} pageCurrent
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.pageCurrent = 0;

        /**
         * Infos pagePrev.
         * @member {number} pagePrev
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.pagePrev = 0;

        /**
         * Infos pageNext.
         * @member {number} pageNext
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.pageNext = 0;

        /**
         * Infos pageLast.
         * @member {number} pageLast
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.pageLast = 0;

        /**
         * Infos pageItemsNb.
         * @member {number} pageItemsNb
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.pageItemsNb = 0;

        /**
         * Infos totalItems.
         * @member {number} totalItems
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.totalItems = 0;

        /**
         * Infos resultsDateTime.
         * @member {string} resultsDateTime
         * @memberof proto.Infos
         * @instance
         */
        Infos.prototype.resultsDateTime = "";

        /**
         * Creates a new Infos instance using the specified properties.
         * @function create
         * @memberof proto.Infos
         * @static
         * @param {proto.IInfos=} [properties] Properties to set
         * @returns {proto.Infos} Infos instance
         */
        Infos.create = function create(properties) {
            return new Infos(properties);
        };

        /**
         * Encodes the specified Infos message. Does not implicitly {@link proto.Infos.verify|verify} messages.
         * @function encode
         * @memberof proto.Infos
         * @static
         * @param {proto.IInfos} message Infos message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Infos.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.pageCurrent != null && Object.hasOwnProperty.call(message, "pageCurrent"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message.pageCurrent);
            if (message.pagePrev != null && Object.hasOwnProperty.call(message, "pagePrev"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.pagePrev);
            if (message.pageNext != null && Object.hasOwnProperty.call(message, "pageNext"))
                writer.uint32(/* id 3, wireType 0 =*/24).int32(message.pageNext);
            if (message.pageLast != null && Object.hasOwnProperty.call(message, "pageLast"))
                writer.uint32(/* id 4, wireType 0 =*/32).int32(message.pageLast);
            if (message.pageItemsNb != null && Object.hasOwnProperty.call(message, "pageItemsNb"))
                writer.uint32(/* id 5, wireType 0 =*/40).int32(message.pageItemsNb);
            if (message.totalItems != null && Object.hasOwnProperty.call(message, "totalItems"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.totalItems);
            if (message.resultsDateTime != null && Object.hasOwnProperty.call(message, "resultsDateTime"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.resultsDateTime);
            return writer;
        };

        /**
         * Encodes the specified Infos message, length delimited. Does not implicitly {@link proto.Infos.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Infos
         * @static
         * @param {proto.IInfos} message Infos message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Infos.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Infos message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Infos
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Infos} Infos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Infos.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Infos();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.pageCurrent = reader.int32();
                        break;
                    }
                case 2: {
                        message.pagePrev = reader.int32();
                        break;
                    }
                case 3: {
                        message.pageNext = reader.int32();
                        break;
                    }
                case 4: {
                        message.pageLast = reader.int32();
                        break;
                    }
                case 5: {
                        message.pageItemsNb = reader.int32();
                        break;
                    }
                case 6: {
                        message.totalItems = reader.int32();
                        break;
                    }
                case 7: {
                        message.resultsDateTime = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Infos message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Infos
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Infos} Infos
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Infos.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Infos message.
         * @function verify
         * @memberof proto.Infos
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Infos.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.pageCurrent != null && message.hasOwnProperty("pageCurrent"))
                if (!$util.isInteger(message.pageCurrent))
                    return "pageCurrent: integer expected";
            if (message.pagePrev != null && message.hasOwnProperty("pagePrev"))
                if (!$util.isInteger(message.pagePrev))
                    return "pagePrev: integer expected";
            if (message.pageNext != null && message.hasOwnProperty("pageNext"))
                if (!$util.isInteger(message.pageNext))
                    return "pageNext: integer expected";
            if (message.pageLast != null && message.hasOwnProperty("pageLast"))
                if (!$util.isInteger(message.pageLast))
                    return "pageLast: integer expected";
            if (message.pageItemsNb != null && message.hasOwnProperty("pageItemsNb"))
                if (!$util.isInteger(message.pageItemsNb))
                    return "pageItemsNb: integer expected";
            if (message.totalItems != null && message.hasOwnProperty("totalItems"))
                if (!$util.isInteger(message.totalItems))
                    return "totalItems: integer expected";
            if (message.resultsDateTime != null && message.hasOwnProperty("resultsDateTime"))
                if (!$util.isString(message.resultsDateTime))
                    return "resultsDateTime: string expected";
            return null;
        };

        /**
         * Creates an Infos message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Infos
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Infos} Infos
         */
        Infos.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Infos)
                return object;
            let message = new $root.proto.Infos();
            if (object.pageCurrent != null)
                message.pageCurrent = object.pageCurrent | 0;
            if (object.pagePrev != null)
                message.pagePrev = object.pagePrev | 0;
            if (object.pageNext != null)
                message.pageNext = object.pageNext | 0;
            if (object.pageLast != null)
                message.pageLast = object.pageLast | 0;
            if (object.pageItemsNb != null)
                message.pageItemsNb = object.pageItemsNb | 0;
            if (object.totalItems != null)
                message.totalItems = object.totalItems | 0;
            if (object.resultsDateTime != null)
                message.resultsDateTime = String(object.resultsDateTime);
            return message;
        };

        /**
         * Creates a plain object from an Infos message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Infos
         * @static
         * @param {proto.Infos} message Infos
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Infos.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.pageCurrent = 0;
                object.pagePrev = 0;
                object.pageNext = 0;
                object.pageLast = 0;
                object.pageItemsNb = 0;
                object.totalItems = 0;
                object.resultsDateTime = "";
            }
            if (message.pageCurrent != null && message.hasOwnProperty("pageCurrent"))
                object.pageCurrent = message.pageCurrent;
            if (message.pagePrev != null && message.hasOwnProperty("pagePrev"))
                object.pagePrev = message.pagePrev;
            if (message.pageNext != null && message.hasOwnProperty("pageNext"))
                object.pageNext = message.pageNext;
            if (message.pageLast != null && message.hasOwnProperty("pageLast"))
                object.pageLast = message.pageLast;
            if (message.pageItemsNb != null && message.hasOwnProperty("pageItemsNb"))
                object.pageItemsNb = message.pageItemsNb;
            if (message.totalItems != null && message.hasOwnProperty("totalItems"))
                object.totalItems = message.totalItems;
            if (message.resultsDateTime != null && message.hasOwnProperty("resultsDateTime"))
                object.resultsDateTime = message.resultsDateTime;
            return object;
        };

        /**
         * Converts this Infos to JSON.
         * @function toJSON
         * @memberof proto.Infos
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Infos.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Infos
         * @function getTypeUrl
         * @memberof proto.Infos
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Infos.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.Infos";
        };

        return Infos;
    })();

    proto.LinesApiResponse = (function() {

        /**
         * Properties of a LinesApiResponse.
         * @memberof proto
         * @interface ILinesApiResponse
         * @property {proto.IInfos|null} [infos] LinesApiResponse infos
         * @property {Array.<proto.ILine>|null} [lines] LinesApiResponse lines
         */

        /**
         * Constructs a new LinesApiResponse.
         * @memberof proto
         * @classdesc Represents a LinesApiResponse.
         * @implements ILinesApiResponse
         * @constructor
         * @param {proto.ILinesApiResponse=} [properties] Properties to set
         */
        function LinesApiResponse(properties) {
            this.lines = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LinesApiResponse infos.
         * @member {proto.IInfos|null|undefined} infos
         * @memberof proto.LinesApiResponse
         * @instance
         */
        LinesApiResponse.prototype.infos = null;

        /**
         * LinesApiResponse lines.
         * @member {Array.<proto.ILine>} lines
         * @memberof proto.LinesApiResponse
         * @instance
         */
        LinesApiResponse.prototype.lines = $util.emptyArray;

        /**
         * Creates a new LinesApiResponse instance using the specified properties.
         * @function create
         * @memberof proto.LinesApiResponse
         * @static
         * @param {proto.ILinesApiResponse=} [properties] Properties to set
         * @returns {proto.LinesApiResponse} LinesApiResponse instance
         */
        LinesApiResponse.create = function create(properties) {
            return new LinesApiResponse(properties);
        };

        /**
         * Encodes the specified LinesApiResponse message. Does not implicitly {@link proto.LinesApiResponse.verify|verify} messages.
         * @function encode
         * @memberof proto.LinesApiResponse
         * @static
         * @param {proto.ILinesApiResponse} message LinesApiResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LinesApiResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.infos != null && Object.hasOwnProperty.call(message, "infos"))
                $root.proto.Infos.encode(message.infos, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.lines != null && message.lines.length)
                for (let i = 0; i < message.lines.length; ++i)
                    $root.proto.Line.encode(message.lines[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LinesApiResponse message, length delimited. Does not implicitly {@link proto.LinesApiResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.LinesApiResponse
         * @static
         * @param {proto.ILinesApiResponse} message LinesApiResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LinesApiResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LinesApiResponse message from the specified reader or buffer.
         * @function decode
         * @memberof proto.LinesApiResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.LinesApiResponse} LinesApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LinesApiResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.LinesApiResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.infos = $root.proto.Infos.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.lines && message.lines.length))
                            message.lines = [];
                        message.lines.push($root.proto.Line.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LinesApiResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.LinesApiResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.LinesApiResponse} LinesApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LinesApiResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LinesApiResponse message.
         * @function verify
         * @memberof proto.LinesApiResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LinesApiResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.infos != null && message.hasOwnProperty("infos")) {
                let error = $root.proto.Infos.verify(message.infos);
                if (error)
                    return "infos." + error;
            }
            if (message.lines != null && message.hasOwnProperty("lines")) {
                if (!Array.isArray(message.lines))
                    return "lines: array expected";
                for (let i = 0; i < message.lines.length; ++i) {
                    let error = $root.proto.Line.verify(message.lines[i]);
                    if (error)
                        return "lines." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LinesApiResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.LinesApiResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.LinesApiResponse} LinesApiResponse
         */
        LinesApiResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.LinesApiResponse)
                return object;
            let message = new $root.proto.LinesApiResponse();
            if (object.infos != null) {
                if (typeof object.infos !== "object")
                    throw TypeError(".proto.LinesApiResponse.infos: object expected");
                message.infos = $root.proto.Infos.fromObject(object.infos);
            }
            if (object.lines) {
                if (!Array.isArray(object.lines))
                    throw TypeError(".proto.LinesApiResponse.lines: array expected");
                message.lines = [];
                for (let i = 0; i < object.lines.length; ++i) {
                    if (typeof object.lines[i] !== "object")
                        throw TypeError(".proto.LinesApiResponse.lines: object expected");
                    message.lines[i] = $root.proto.Line.fromObject(object.lines[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LinesApiResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.LinesApiResponse
         * @static
         * @param {proto.LinesApiResponse} message LinesApiResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LinesApiResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.lines = [];
            if (options.defaults)
                object.infos = null;
            if (message.infos != null && message.hasOwnProperty("infos"))
                object.infos = $root.proto.Infos.toObject(message.infos, options);
            if (message.lines && message.lines.length) {
                object.lines = [];
                for (let j = 0; j < message.lines.length; ++j)
                    object.lines[j] = $root.proto.Line.toObject(message.lines[j], options);
            }
            return object;
        };

        /**
         * Converts this LinesApiResponse to JSON.
         * @function toJSON
         * @memberof proto.LinesApiResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LinesApiResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LinesApiResponse
         * @function getTypeUrl
         * @memberof proto.LinesApiResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LinesApiResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.LinesApiResponse";
        };

        return LinesApiResponse;
    })();

    proto.Line = (function() {

        /**
         * Properties of a Line.
         * @memberof proto
         * @interface ILine
         * @property {string|null} [ref] Line ref
         * @property {string|null} [longname] Line longname
         * @property {string|null} [shortname] Line shortname
         * @property {string|null} [color] Line color
         * @property {string|null} [colortext] Line colortext
         * @property {number|null} [type] Line type
         * @property {number|null} [order] Line order
         * @property {string|null} [categ] Line categ
         */

        /**
         * Constructs a new Line.
         * @memberof proto
         * @classdesc Represents a Line.
         * @implements ILine
         * @constructor
         * @param {proto.ILine=} [properties] Properties to set
         */
        function Line(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Line ref.
         * @member {string} ref
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.ref = "";

        /**
         * Line longname.
         * @member {string} longname
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.longname = "";

        /**
         * Line shortname.
         * @member {string} shortname
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.shortname = "";

        /**
         * Line color.
         * @member {string} color
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.color = "";

        /**
         * Line colortext.
         * @member {string} colortext
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.colortext = "";

        /**
         * Line type.
         * @member {number} type
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.type = 0;

        /**
         * Line order.
         * @member {number} order
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.order = 0;

        /**
         * Line categ.
         * @member {string} categ
         * @memberof proto.Line
         * @instance
         */
        Line.prototype.categ = "";

        /**
         * Creates a new Line instance using the specified properties.
         * @function create
         * @memberof proto.Line
         * @static
         * @param {proto.ILine=} [properties] Properties to set
         * @returns {proto.Line} Line instance
         */
        Line.create = function create(properties) {
            return new Line(properties);
        };

        /**
         * Encodes the specified Line message. Does not implicitly {@link proto.Line.verify|verify} messages.
         * @function encode
         * @memberof proto.Line
         * @static
         * @param {proto.ILine} message Line message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Line.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.ref);
            if (message.longname != null && Object.hasOwnProperty.call(message, "longname"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.longname);
            if (message.shortname != null && Object.hasOwnProperty.call(message, "shortname"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.shortname);
            if (message.color != null && Object.hasOwnProperty.call(message, "color"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.color);
            if (message.colortext != null && Object.hasOwnProperty.call(message, "colortext"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message.colortext);
            if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                writer.uint32(/* id 6, wireType 0 =*/48).int32(message.type);
            if (message.order != null && Object.hasOwnProperty.call(message, "order"))
                writer.uint32(/* id 7, wireType 0 =*/56).int32(message.order);
            if (message.categ != null && Object.hasOwnProperty.call(message, "categ"))
                writer.uint32(/* id 8, wireType 2 =*/66).string(message.categ);
            return writer;
        };

        /**
         * Encodes the specified Line message, length delimited. Does not implicitly {@link proto.Line.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Line
         * @static
         * @param {proto.ILine} message Line message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Line.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Line message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Line
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Line} Line
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Line.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Line();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.ref = reader.string();
                        break;
                    }
                case 2: {
                        message.longname = reader.string();
                        break;
                    }
                case 3: {
                        message.shortname = reader.string();
                        break;
                    }
                case 4: {
                        message.color = reader.string();
                        break;
                    }
                case 5: {
                        message.colortext = reader.string();
                        break;
                    }
                case 6: {
                        message.type = reader.int32();
                        break;
                    }
                case 7: {
                        message.order = reader.int32();
                        break;
                    }
                case 8: {
                        message.categ = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Line message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Line
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Line} Line
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Line.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Line message.
         * @function verify
         * @memberof proto.Line
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Line.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.ref != null && message.hasOwnProperty("ref"))
                if (!$util.isString(message.ref))
                    return "ref: string expected";
            if (message.longname != null && message.hasOwnProperty("longname"))
                if (!$util.isString(message.longname))
                    return "longname: string expected";
            if (message.shortname != null && message.hasOwnProperty("shortname"))
                if (!$util.isString(message.shortname))
                    return "shortname: string expected";
            if (message.color != null && message.hasOwnProperty("color"))
                if (!$util.isString(message.color))
                    return "color: string expected";
            if (message.colortext != null && message.hasOwnProperty("colortext"))
                if (!$util.isString(message.colortext))
                    return "colortext: string expected";
            if (message.type != null && message.hasOwnProperty("type"))
                if (!$util.isInteger(message.type))
                    return "type: integer expected";
            if (message.order != null && message.hasOwnProperty("order"))
                if (!$util.isInteger(message.order))
                    return "order: integer expected";
            if (message.categ != null && message.hasOwnProperty("categ"))
                if (!$util.isString(message.categ))
                    return "categ: string expected";
            return null;
        };

        /**
         * Creates a Line message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Line
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Line} Line
         */
        Line.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Line)
                return object;
            let message = new $root.proto.Line();
            if (object.ref != null)
                message.ref = String(object.ref);
            if (object.longname != null)
                message.longname = String(object.longname);
            if (object.shortname != null)
                message.shortname = String(object.shortname);
            if (object.color != null)
                message.color = String(object.color);
            if (object.colortext != null)
                message.colortext = String(object.colortext);
            if (object.type != null)
                message.type = object.type | 0;
            if (object.order != null)
                message.order = object.order | 0;
            if (object.categ != null)
                message.categ = String(object.categ);
            return message;
        };

        /**
         * Creates a plain object from a Line message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Line
         * @static
         * @param {proto.Line} message Line
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Line.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.ref = "";
                object.longname = "";
                object.shortname = "";
                object.color = "";
                object.colortext = "";
                object.type = 0;
                object.order = 0;
                object.categ = "";
            }
            if (message.ref != null && message.hasOwnProperty("ref"))
                object.ref = message.ref;
            if (message.longname != null && message.hasOwnProperty("longname"))
                object.longname = message.longname;
            if (message.shortname != null && message.hasOwnProperty("shortname"))
                object.shortname = message.shortname;
            if (message.color != null && message.hasOwnProperty("color"))
                object.color = message.color;
            if (message.colortext != null && message.hasOwnProperty("colortext"))
                object.colortext = message.colortext;
            if (message.type != null && message.hasOwnProperty("type"))
                object.type = message.type;
            if (message.order != null && message.hasOwnProperty("order"))
                object.order = message.order;
            if (message.categ != null && message.hasOwnProperty("categ"))
                object.categ = message.categ;
            return object;
        };

        /**
         * Converts this Line to JSON.
         * @function toJSON
         * @memberof proto.Line
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Line.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Line
         * @function getTypeUrl
         * @memberof proto.Line
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Line.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.Line";
        };

        return Line;
    })();

    proto.StopsApiResponse = (function() {

        /**
         * Properties of a StopsApiResponse.
         * @memberof proto
         * @interface IStopsApiResponse
         * @property {proto.IInfos|null} [infos] StopsApiResponse infos
         * @property {Array.<proto.IStop>|null} [stops] StopsApiResponse stops
         */

        /**
         * Constructs a new StopsApiResponse.
         * @memberof proto
         * @classdesc Represents a StopsApiResponse.
         * @implements IStopsApiResponse
         * @constructor
         * @param {proto.IStopsApiResponse=} [properties] Properties to set
         */
        function StopsApiResponse(properties) {
            this.stops = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StopsApiResponse infos.
         * @member {proto.IInfos|null|undefined} infos
         * @memberof proto.StopsApiResponse
         * @instance
         */
        StopsApiResponse.prototype.infos = null;

        /**
         * StopsApiResponse stops.
         * @member {Array.<proto.IStop>} stops
         * @memberof proto.StopsApiResponse
         * @instance
         */
        StopsApiResponse.prototype.stops = $util.emptyArray;

        /**
         * Creates a new StopsApiResponse instance using the specified properties.
         * @function create
         * @memberof proto.StopsApiResponse
         * @static
         * @param {proto.IStopsApiResponse=} [properties] Properties to set
         * @returns {proto.StopsApiResponse} StopsApiResponse instance
         */
        StopsApiResponse.create = function create(properties) {
            return new StopsApiResponse(properties);
        };

        /**
         * Encodes the specified StopsApiResponse message. Does not implicitly {@link proto.StopsApiResponse.verify|verify} messages.
         * @function encode
         * @memberof proto.StopsApiResponse
         * @static
         * @param {proto.IStopsApiResponse} message StopsApiResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopsApiResponse.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.infos != null && Object.hasOwnProperty.call(message, "infos"))
                $root.proto.Infos.encode(message.infos, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.stops != null && message.stops.length)
                for (let i = 0; i < message.stops.length; ++i)
                    $root.proto.Stop.encode(message.stops[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified StopsApiResponse message, length delimited. Does not implicitly {@link proto.StopsApiResponse.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.StopsApiResponse
         * @static
         * @param {proto.IStopsApiResponse} message StopsApiResponse message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopsApiResponse.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StopsApiResponse message from the specified reader or buffer.
         * @function decode
         * @memberof proto.StopsApiResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.StopsApiResponse} StopsApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopsApiResponse.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.StopsApiResponse();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.infos = $root.proto.Infos.decode(reader, reader.uint32());
                        break;
                    }
                case 2: {
                        if (!(message.stops && message.stops.length))
                            message.stops = [];
                        message.stops.push($root.proto.Stop.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StopsApiResponse message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.StopsApiResponse
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.StopsApiResponse} StopsApiResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopsApiResponse.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StopsApiResponse message.
         * @function verify
         * @memberof proto.StopsApiResponse
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StopsApiResponse.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.infos != null && message.hasOwnProperty("infos")) {
                let error = $root.proto.Infos.verify(message.infos);
                if (error)
                    return "infos." + error;
            }
            if (message.stops != null && message.hasOwnProperty("stops")) {
                if (!Array.isArray(message.stops))
                    return "stops: array expected";
                for (let i = 0; i < message.stops.length; ++i) {
                    let error = $root.proto.Stop.verify(message.stops[i]);
                    if (error)
                        return "stops." + error;
                }
            }
            return null;
        };

        /**
         * Creates a StopsApiResponse message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.StopsApiResponse
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.StopsApiResponse} StopsApiResponse
         */
        StopsApiResponse.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.StopsApiResponse)
                return object;
            let message = new $root.proto.StopsApiResponse();
            if (object.infos != null) {
                if (typeof object.infos !== "object")
                    throw TypeError(".proto.StopsApiResponse.infos: object expected");
                message.infos = $root.proto.Infos.fromObject(object.infos);
            }
            if (object.stops) {
                if (!Array.isArray(object.stops))
                    throw TypeError(".proto.StopsApiResponse.stops: array expected");
                message.stops = [];
                for (let i = 0; i < object.stops.length; ++i) {
                    if (typeof object.stops[i] !== "object")
                        throw TypeError(".proto.StopsApiResponse.stops: object expected");
                    message.stops[i] = $root.proto.Stop.fromObject(object.stops[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a StopsApiResponse message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.StopsApiResponse
         * @static
         * @param {proto.StopsApiResponse} message StopsApiResponse
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StopsApiResponse.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.stops = [];
            if (options.defaults)
                object.infos = null;
            if (message.infos != null && message.hasOwnProperty("infos"))
                object.infos = $root.proto.Infos.toObject(message.infos, options);
            if (message.stops && message.stops.length) {
                object.stops = [];
                for (let j = 0; j < message.stops.length; ++j)
                    object.stops[j] = $root.proto.Stop.toObject(message.stops[j], options);
            }
            return object;
        };

        /**
         * Converts this StopsApiResponse to JSON.
         * @function toJSON
         * @memberof proto.StopsApiResponse
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StopsApiResponse.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StopsApiResponse
         * @function getTypeUrl
         * @memberof proto.StopsApiResponse
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StopsApiResponse.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.StopsApiResponse";
        };

        return StopsApiResponse;
    })();

    proto.Stop = (function() {

        /**
         * Properties of a Stop.
         * @memberof proto
         * @interface IStop
         * @property {string|null} [name] Stop name
         * @property {string|null} [ref] Stop ref
         * @property {string|null} [city] Stop city
         * @property {proto.ILocation|null} [location] Stop location
         * @property {Array.<proto.IStopPoint>|null} [spoints] Stop spoints
         * @property {Array.<proto.ILightLine>|null} [lines] Stop lines
         */

        /**
         * Constructs a new Stop.
         * @memberof proto
         * @classdesc Represents a Stop.
         * @implements IStop
         * @constructor
         * @param {proto.IStop=} [properties] Properties to set
         */
        function Stop(properties) {
            this.spoints = [];
            this.lines = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Stop name.
         * @member {string} name
         * @memberof proto.Stop
         * @instance
         */
        Stop.prototype.name = "";

        /**
         * Stop ref.
         * @member {string} ref
         * @memberof proto.Stop
         * @instance
         */
        Stop.prototype.ref = "";

        /**
         * Stop city.
         * @member {string} city
         * @memberof proto.Stop
         * @instance
         */
        Stop.prototype.city = "";

        /**
         * Stop location.
         * @member {proto.ILocation|null|undefined} location
         * @memberof proto.Stop
         * @instance
         */
        Stop.prototype.location = null;

        /**
         * Stop spoints.
         * @member {Array.<proto.IStopPoint>} spoints
         * @memberof proto.Stop
         * @instance
         */
        Stop.prototype.spoints = $util.emptyArray;

        /**
         * Stop lines.
         * @member {Array.<proto.ILightLine>} lines
         * @memberof proto.Stop
         * @instance
         */
        Stop.prototype.lines = $util.emptyArray;

        /**
         * Creates a new Stop instance using the specified properties.
         * @function create
         * @memberof proto.Stop
         * @static
         * @param {proto.IStop=} [properties] Properties to set
         * @returns {proto.Stop} Stop instance
         */
        Stop.create = function create(properties) {
            return new Stop(properties);
        };

        /**
         * Encodes the specified Stop message. Does not implicitly {@link proto.Stop.verify|verify} messages.
         * @function encode
         * @memberof proto.Stop
         * @static
         * @param {proto.IStop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.name != null && Object.hasOwnProperty.call(message, "name"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ref);
            if (message.city != null && Object.hasOwnProperty.call(message, "city"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.city);
            if (message.location != null && Object.hasOwnProperty.call(message, "location"))
                $root.proto.Location.encode(message.location, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.spoints != null && message.spoints.length)
                for (let i = 0; i < message.spoints.length; ++i)
                    $root.proto.StopPoint.encode(message.spoints[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.lines != null && message.lines.length)
                for (let i = 0; i < message.lines.length; ++i)
                    $root.proto.LightLine.encode(message.lines[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Stop message, length delimited. Does not implicitly {@link proto.Stop.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Stop
         * @static
         * @param {proto.IStop} message Stop message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Stop.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Stop message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Stop();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.name = reader.string();
                        break;
                    }
                case 2: {
                        message.ref = reader.string();
                        break;
                    }
                case 3: {
                        message.city = reader.string();
                        break;
                    }
                case 4: {
                        message.location = $root.proto.Location.decode(reader, reader.uint32());
                        break;
                    }
                case 5: {
                        if (!(message.spoints && message.spoints.length))
                            message.spoints = [];
                        message.spoints.push($root.proto.StopPoint.decode(reader, reader.uint32()));
                        break;
                    }
                case 6: {
                        if (!(message.lines && message.lines.length))
                            message.lines = [];
                        message.lines.push($root.proto.LightLine.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Stop message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Stop
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Stop} Stop
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Stop.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Stop message.
         * @function verify
         * @memberof proto.Stop
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Stop.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.name != null && message.hasOwnProperty("name"))
                if (!$util.isString(message.name))
                    return "name: string expected";
            if (message.ref != null && message.hasOwnProperty("ref"))
                if (!$util.isString(message.ref))
                    return "ref: string expected";
            if (message.city != null && message.hasOwnProperty("city"))
                if (!$util.isString(message.city))
                    return "city: string expected";
            if (message.location != null && message.hasOwnProperty("location")) {
                let error = $root.proto.Location.verify(message.location);
                if (error)
                    return "location." + error;
            }
            if (message.spoints != null && message.hasOwnProperty("spoints")) {
                if (!Array.isArray(message.spoints))
                    return "spoints: array expected";
                for (let i = 0; i < message.spoints.length; ++i) {
                    let error = $root.proto.StopPoint.verify(message.spoints[i]);
                    if (error)
                        return "spoints." + error;
                }
            }
            if (message.lines != null && message.hasOwnProperty("lines")) {
                if (!Array.isArray(message.lines))
                    return "lines: array expected";
                for (let i = 0; i < message.lines.length; ++i) {
                    let error = $root.proto.LightLine.verify(message.lines[i]);
                    if (error)
                        return "lines." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Stop message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Stop
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Stop} Stop
         */
        Stop.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Stop)
                return object;
            let message = new $root.proto.Stop();
            if (object.name != null)
                message.name = String(object.name);
            if (object.ref != null)
                message.ref = String(object.ref);
            if (object.city != null)
                message.city = String(object.city);
            if (object.location != null) {
                if (typeof object.location !== "object")
                    throw TypeError(".proto.Stop.location: object expected");
                message.location = $root.proto.Location.fromObject(object.location);
            }
            if (object.spoints) {
                if (!Array.isArray(object.spoints))
                    throw TypeError(".proto.Stop.spoints: array expected");
                message.spoints = [];
                for (let i = 0; i < object.spoints.length; ++i) {
                    if (typeof object.spoints[i] !== "object")
                        throw TypeError(".proto.Stop.spoints: object expected");
                    message.spoints[i] = $root.proto.StopPoint.fromObject(object.spoints[i]);
                }
            }
            if (object.lines) {
                if (!Array.isArray(object.lines))
                    throw TypeError(".proto.Stop.lines: array expected");
                message.lines = [];
                for (let i = 0; i < object.lines.length; ++i) {
                    if (typeof object.lines[i] !== "object")
                        throw TypeError(".proto.Stop.lines: object expected");
                    message.lines[i] = $root.proto.LightLine.fromObject(object.lines[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Stop message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Stop
         * @static
         * @param {proto.Stop} message Stop
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Stop.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults) {
                object.spoints = [];
                object.lines = [];
            }
            if (options.defaults) {
                object.name = "";
                object.ref = "";
                object.city = "";
                object.location = null;
            }
            if (message.name != null && message.hasOwnProperty("name"))
                object.name = message.name;
            if (message.ref != null && message.hasOwnProperty("ref"))
                object.ref = message.ref;
            if (message.city != null && message.hasOwnProperty("city"))
                object.city = message.city;
            if (message.location != null && message.hasOwnProperty("location"))
                object.location = $root.proto.Location.toObject(message.location, options);
            if (message.spoints && message.spoints.length) {
                object.spoints = [];
                for (let j = 0; j < message.spoints.length; ++j)
                    object.spoints[j] = $root.proto.StopPoint.toObject(message.spoints[j], options);
            }
            if (message.lines && message.lines.length) {
                object.lines = [];
                for (let j = 0; j < message.lines.length; ++j)
                    object.lines[j] = $root.proto.LightLine.toObject(message.lines[j], options);
            }
            return object;
        };

        /**
         * Converts this Stop to JSON.
         * @function toJSON
         * @memberof proto.Stop
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Stop.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Stop
         * @function getTypeUrl
         * @memberof proto.Stop
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Stop.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.Stop";
        };

        return Stop;
    })();

    proto.StopPoint = (function() {

        /**
         * Properties of a StopPoint.
         * @memberof proto
         * @interface IStopPoint
         * @property {string|null} [id] StopPoint id
         * @property {string|null} [city] StopPoint city
         * @property {number|null} [latitude] StopPoint latitude
         * @property {number|null} [longitude] StopPoint longitude
         * @property {Array.<proto.ILightLine>|null} [lines] StopPoint lines
         */

        /**
         * Constructs a new StopPoint.
         * @memberof proto
         * @classdesc Represents a StopPoint.
         * @implements IStopPoint
         * @constructor
         * @param {proto.IStopPoint=} [properties] Properties to set
         */
        function StopPoint(properties) {
            this.lines = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * StopPoint id.
         * @member {string} id
         * @memberof proto.StopPoint
         * @instance
         */
        StopPoint.prototype.id = "";

        /**
         * StopPoint city.
         * @member {string} city
         * @memberof proto.StopPoint
         * @instance
         */
        StopPoint.prototype.city = "";

        /**
         * StopPoint latitude.
         * @member {number} latitude
         * @memberof proto.StopPoint
         * @instance
         */
        StopPoint.prototype.latitude = 0;

        /**
         * StopPoint longitude.
         * @member {number} longitude
         * @memberof proto.StopPoint
         * @instance
         */
        StopPoint.prototype.longitude = 0;

        /**
         * StopPoint lines.
         * @member {Array.<proto.ILightLine>} lines
         * @memberof proto.StopPoint
         * @instance
         */
        StopPoint.prototype.lines = $util.emptyArray;

        /**
         * Creates a new StopPoint instance using the specified properties.
         * @function create
         * @memberof proto.StopPoint
         * @static
         * @param {proto.IStopPoint=} [properties] Properties to set
         * @returns {proto.StopPoint} StopPoint instance
         */
        StopPoint.create = function create(properties) {
            return new StopPoint(properties);
        };

        /**
         * Encodes the specified StopPoint message. Does not implicitly {@link proto.StopPoint.verify|verify} messages.
         * @function encode
         * @memberof proto.StopPoint
         * @static
         * @param {proto.IStopPoint} message StopPoint message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopPoint.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.city != null && Object.hasOwnProperty.call(message, "city"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.city);
            if (message.latitude != null && Object.hasOwnProperty.call(message, "latitude"))
                writer.uint32(/* id 3, wireType 5 =*/29).float(message.latitude);
            if (message.longitude != null && Object.hasOwnProperty.call(message, "longitude"))
                writer.uint32(/* id 4, wireType 5 =*/37).float(message.longitude);
            if (message.lines != null && message.lines.length)
                for (let i = 0; i < message.lines.length; ++i)
                    $root.proto.LightLine.encode(message.lines[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified StopPoint message, length delimited. Does not implicitly {@link proto.StopPoint.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.StopPoint
         * @static
         * @param {proto.IStopPoint} message StopPoint message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        StopPoint.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a StopPoint message from the specified reader or buffer.
         * @function decode
         * @memberof proto.StopPoint
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.StopPoint} StopPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopPoint.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.StopPoint();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.city = reader.string();
                        break;
                    }
                case 3: {
                        message.latitude = reader.float();
                        break;
                    }
                case 4: {
                        message.longitude = reader.float();
                        break;
                    }
                case 5: {
                        if (!(message.lines && message.lines.length))
                            message.lines = [];
                        message.lines.push($root.proto.LightLine.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a StopPoint message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.StopPoint
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.StopPoint} StopPoint
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        StopPoint.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a StopPoint message.
         * @function verify
         * @memberof proto.StopPoint
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        StopPoint.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.city != null && message.hasOwnProperty("city"))
                if (!$util.isString(message.city))
                    return "city: string expected";
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                if (typeof message.latitude !== "number")
                    return "latitude: number expected";
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                if (typeof message.longitude !== "number")
                    return "longitude: number expected";
            if (message.lines != null && message.hasOwnProperty("lines")) {
                if (!Array.isArray(message.lines))
                    return "lines: array expected";
                for (let i = 0; i < message.lines.length; ++i) {
                    let error = $root.proto.LightLine.verify(message.lines[i]);
                    if (error)
                        return "lines." + error;
                }
            }
            return null;
        };

        /**
         * Creates a StopPoint message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.StopPoint
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.StopPoint} StopPoint
         */
        StopPoint.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.StopPoint)
                return object;
            let message = new $root.proto.StopPoint();
            if (object.id != null)
                message.id = String(object.id);
            if (object.city != null)
                message.city = String(object.city);
            if (object.latitude != null)
                message.latitude = Number(object.latitude);
            if (object.longitude != null)
                message.longitude = Number(object.longitude);
            if (object.lines) {
                if (!Array.isArray(object.lines))
                    throw TypeError(".proto.StopPoint.lines: array expected");
                message.lines = [];
                for (let i = 0; i < object.lines.length; ++i) {
                    if (typeof object.lines[i] !== "object")
                        throw TypeError(".proto.StopPoint.lines: object expected");
                    message.lines[i] = $root.proto.LightLine.fromObject(object.lines[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a StopPoint message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.StopPoint
         * @static
         * @param {proto.StopPoint} message StopPoint
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        StopPoint.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.lines = [];
            if (options.defaults) {
                object.id = "";
                object.city = "";
                object.latitude = 0;
                object.longitude = 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.city != null && message.hasOwnProperty("city"))
                object.city = message.city;
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
            if (message.lines && message.lines.length) {
                object.lines = [];
                for (let j = 0; j < message.lines.length; ++j)
                    object.lines[j] = $root.proto.LightLine.toObject(message.lines[j], options);
            }
            return object;
        };

        /**
         * Converts this StopPoint to JSON.
         * @function toJSON
         * @memberof proto.StopPoint
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        StopPoint.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for StopPoint
         * @function getTypeUrl
         * @memberof proto.StopPoint
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        StopPoint.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.StopPoint";
        };

        return StopPoint;
    })();

    proto.LightLine = (function() {

        /**
         * Properties of a LightLine.
         * @memberof proto
         * @interface ILightLine
         * @property {string|null} [id] LightLine id
         * @property {string|null} [ref] LightLine ref
         * @property {Array.<proto.IDestination>|null} [dests] LightLine dests
         */

        /**
         * Constructs a new LightLine.
         * @memberof proto
         * @classdesc Represents a LightLine.
         * @implements ILightLine
         * @constructor
         * @param {proto.ILightLine=} [properties] Properties to set
         */
        function LightLine(properties) {
            this.dests = [];
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LightLine id.
         * @member {string} id
         * @memberof proto.LightLine
         * @instance
         */
        LightLine.prototype.id = "";

        /**
         * LightLine ref.
         * @member {string} ref
         * @memberof proto.LightLine
         * @instance
         */
        LightLine.prototype.ref = "";

        /**
         * LightLine dests.
         * @member {Array.<proto.IDestination>} dests
         * @memberof proto.LightLine
         * @instance
         */
        LightLine.prototype.dests = $util.emptyArray;

        /**
         * Creates a new LightLine instance using the specified properties.
         * @function create
         * @memberof proto.LightLine
         * @static
         * @param {proto.ILightLine=} [properties] Properties to set
         * @returns {proto.LightLine} LightLine instance
         */
        LightLine.create = function create(properties) {
            return new LightLine(properties);
        };

        /**
         * Encodes the specified LightLine message. Does not implicitly {@link proto.LightLine.verify|verify} messages.
         * @function encode
         * @memberof proto.LightLine
         * @static
         * @param {proto.ILightLine} message LightLine message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LightLine.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
            if (message.ref != null && Object.hasOwnProperty.call(message, "ref"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.ref);
            if (message.dests != null && message.dests.length)
                for (let i = 0; i < message.dests.length; ++i)
                    $root.proto.Destination.encode(message.dests[i], writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified LightLine message, length delimited. Does not implicitly {@link proto.LightLine.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.LightLine
         * @static
         * @param {proto.ILightLine} message LightLine message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LightLine.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LightLine message from the specified reader or buffer.
         * @function decode
         * @memberof proto.LightLine
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.LightLine} LightLine
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LightLine.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.LightLine();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.id = reader.string();
                        break;
                    }
                case 2: {
                        message.ref = reader.string();
                        break;
                    }
                case 3: {
                        if (!(message.dests && message.dests.length))
                            message.dests = [];
                        message.dests.push($root.proto.Destination.decode(reader, reader.uint32()));
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a LightLine message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.LightLine
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.LightLine} LightLine
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LightLine.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LightLine message.
         * @function verify
         * @memberof proto.LightLine
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LightLine.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isString(message.id))
                    return "id: string expected";
            if (message.ref != null && message.hasOwnProperty("ref"))
                if (!$util.isString(message.ref))
                    return "ref: string expected";
            if (message.dests != null && message.hasOwnProperty("dests")) {
                if (!Array.isArray(message.dests))
                    return "dests: array expected";
                for (let i = 0; i < message.dests.length; ++i) {
                    let error = $root.proto.Destination.verify(message.dests[i]);
                    if (error)
                        return "dests." + error;
                }
            }
            return null;
        };

        /**
         * Creates a LightLine message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.LightLine
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.LightLine} LightLine
         */
        LightLine.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.LightLine)
                return object;
            let message = new $root.proto.LightLine();
            if (object.id != null)
                message.id = String(object.id);
            if (object.ref != null)
                message.ref = String(object.ref);
            if (object.dests) {
                if (!Array.isArray(object.dests))
                    throw TypeError(".proto.LightLine.dests: array expected");
                message.dests = [];
                for (let i = 0; i < object.dests.length; ++i) {
                    if (typeof object.dests[i] !== "object")
                        throw TypeError(".proto.LightLine.dests: object expected");
                    message.dests[i] = $root.proto.Destination.fromObject(object.dests[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a LightLine message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.LightLine
         * @static
         * @param {proto.LightLine} message LightLine
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LightLine.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.arrays || options.defaults)
                object.dests = [];
            if (options.defaults) {
                object.id = "";
                object.ref = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.ref != null && message.hasOwnProperty("ref"))
                object.ref = message.ref;
            if (message.dests && message.dests.length) {
                object.dests = [];
                for (let j = 0; j < message.dests.length; ++j)
                    object.dests[j] = $root.proto.Destination.toObject(message.dests[j], options);
            }
            return object;
        };

        /**
         * Converts this LightLine to JSON.
         * @function toJSON
         * @memberof proto.LightLine
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LightLine.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LightLine
         * @function getTypeUrl
         * @memberof proto.LightLine
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LightLine.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.LightLine";
        };

        return LightLine;
    })();

    proto.Destination = (function() {

        /**
         * Properties of a Destination.
         * @memberof proto
         * @interface IDestination
         * @property {string|null} [lib] Destination lib
         */

        /**
         * Constructs a new Destination.
         * @memberof proto
         * @classdesc Represents a Destination.
         * @implements IDestination
         * @constructor
         * @param {proto.IDestination=} [properties] Properties to set
         */
        function Destination(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Destination lib.
         * @member {string} lib
         * @memberof proto.Destination
         * @instance
         */
        Destination.prototype.lib = "";

        /**
         * Creates a new Destination instance using the specified properties.
         * @function create
         * @memberof proto.Destination
         * @static
         * @param {proto.IDestination=} [properties] Properties to set
         * @returns {proto.Destination} Destination instance
         */
        Destination.create = function create(properties) {
            return new Destination(properties);
        };

        /**
         * Encodes the specified Destination message. Does not implicitly {@link proto.Destination.verify|verify} messages.
         * @function encode
         * @memberof proto.Destination
         * @static
         * @param {proto.IDestination} message Destination message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Destination.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lib != null && Object.hasOwnProperty.call(message, "lib"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.lib);
            return writer;
        };

        /**
         * Encodes the specified Destination message, length delimited. Does not implicitly {@link proto.Destination.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Destination
         * @static
         * @param {proto.IDestination} message Destination message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Destination.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Destination message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Destination
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Destination} Destination
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Destination.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Destination();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.lib = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Destination message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Destination
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Destination} Destination
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Destination.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Destination message.
         * @function verify
         * @memberof proto.Destination
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Destination.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lib != null && message.hasOwnProperty("lib"))
                if (!$util.isString(message.lib))
                    return "lib: string expected";
            return null;
        };

        /**
         * Creates a Destination message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Destination
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Destination} Destination
         */
        Destination.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Destination)
                return object;
            let message = new $root.proto.Destination();
            if (object.lib != null)
                message.lib = String(object.lib);
            return message;
        };

        /**
         * Creates a plain object from a Destination message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Destination
         * @static
         * @param {proto.Destination} message Destination
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Destination.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults)
                object.lib = "";
            if (message.lib != null && message.hasOwnProperty("lib"))
                object.lib = message.lib;
            return object;
        };

        /**
         * Converts this Destination to JSON.
         * @function toJSON
         * @memberof proto.Destination
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Destination.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Destination
         * @function getTypeUrl
         * @memberof proto.Destination
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Destination.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.Destination";
        };

        return Destination;
    })();

    proto.Location = (function() {

        /**
         * Properties of a Location.
         * @memberof proto
         * @interface ILocation
         * @property {number|null} [latitude] Location latitude
         * @property {number|null} [longitude] Location longitude
         */

        /**
         * Constructs a new Location.
         * @memberof proto
         * @classdesc Represents a Location.
         * @implements ILocation
         * @constructor
         * @param {proto.ILocation=} [properties] Properties to set
         */
        function Location(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Location latitude.
         * @member {number} latitude
         * @memberof proto.Location
         * @instance
         */
        Location.prototype.latitude = 0;

        /**
         * Location longitude.
         * @member {number} longitude
         * @memberof proto.Location
         * @instance
         */
        Location.prototype.longitude = 0;

        /**
         * Creates a new Location instance using the specified properties.
         * @function create
         * @memberof proto.Location
         * @static
         * @param {proto.ILocation=} [properties] Properties to set
         * @returns {proto.Location} Location instance
         */
        Location.create = function create(properties) {
            return new Location(properties);
        };

        /**
         * Encodes the specified Location message. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @function encode
         * @memberof proto.Location
         * @static
         * @param {proto.ILocation} message Location message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Location.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.latitude != null && Object.hasOwnProperty.call(message, "latitude"))
                writer.uint32(/* id 1, wireType 5 =*/13).float(message.latitude);
            if (message.longitude != null && Object.hasOwnProperty.call(message, "longitude"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.longitude);
            return writer;
        };

        /**
         * Encodes the specified Location message, length delimited. Does not implicitly {@link proto.Location.verify|verify} messages.
         * @function encodeDelimited
         * @memberof proto.Location
         * @static
         * @param {proto.ILocation} message Location message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Location.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Location message from the specified reader or buffer.
         * @function decode
         * @memberof proto.Location
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {proto.Location} Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Location.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.proto.Location();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message.latitude = reader.float();
                        break;
                    }
                case 2: {
                        message.longitude = reader.float();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Location message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof proto.Location
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {proto.Location} Location
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Location.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Location message.
         * @function verify
         * @memberof proto.Location
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Location.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                if (typeof message.latitude !== "number")
                    return "latitude: number expected";
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                if (typeof message.longitude !== "number")
                    return "longitude: number expected";
            return null;
        };

        /**
         * Creates a Location message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof proto.Location
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {proto.Location} Location
         */
        Location.fromObject = function fromObject(object) {
            if (object instanceof $root.proto.Location)
                return object;
            let message = new $root.proto.Location();
            if (object.latitude != null)
                message.latitude = Number(object.latitude);
            if (object.longitude != null)
                message.longitude = Number(object.longitude);
            return message;
        };

        /**
         * Creates a plain object from a Location message. Also converts values to other types if specified.
         * @function toObject
         * @memberof proto.Location
         * @static
         * @param {proto.Location} message Location
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Location.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object.latitude = 0;
                object.longitude = 0;
            }
            if (message.latitude != null && message.hasOwnProperty("latitude"))
                object.latitude = options.json && !isFinite(message.latitude) ? String(message.latitude) : message.latitude;
            if (message.longitude != null && message.hasOwnProperty("longitude"))
                object.longitude = options.json && !isFinite(message.longitude) ? String(message.longitude) : message.longitude;
            return object;
        };

        /**
         * Converts this Location to JSON.
         * @function toJSON
         * @memberof proto.Location
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Location.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Location
         * @function getTypeUrl
         * @memberof proto.Location
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Location.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/proto.Location";
        };

        return Location;
    })();

    return proto;
})();

export { $root as default };
