"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldNDVI = void 0;
var axios_1 = require("axios");
var geotiff_1 = require("geotiff");
var sentinel_auth_service_1 = require("./sentinel-auth.service");
var NDVI_EVALSCRIPT = "\n//VERSION=3\n\nfunction setup() {\n  return {\n    input: [\n      {\n        bands: [\"B04\", \"B08\", \"SCL\"],\n        units: [\"REFLECTANCE\", \"REFLECTANCE\", \"DN\"]\n      }\n    ],\n    output: {\n      bands: 1,\n      sampleType: \"FLOAT32\"\n    }\n  };\n}\n\nfunction evaluatePixel(sample) {\n\n  // Ignore cloud and invalid pixels.\n  if (\n    sample.SCL === 3 ||\n    sample.SCL === 8 ||\n    sample.SCL === 9 ||\n    sample.SCL === 10 ||\n    sample.SCL === 11\n  ) {\n    return [NaN];\n  }\n\n  const ndvi =\n    (sample.B08 - sample.B04) /\n    (sample.B08 + sample.B04);\n\n  return [ndvi];\n}\n";
function getFieldNDVI(coordinates, fromDate, toDate) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var token, response, responseBuffer, arrayBuffer, tiff, image, raster, ndvi, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, (0, sentinel_auth_service_1.getSentinelAccessToken)()];
                case 1:
                    token = _d.sent();
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, axios_1.default.post(process.env.COPERNICUS_PROCESS_URL, {
                            input: {
                                bounds: {
                                    geometry: {
                                        type: "Polygon",
                                        coordinates: coordinates,
                                    },
                                },
                                type: "image/tiff",
                                data: [
                                    {
                                        type: "sentinel-2-l2a",
                                        dataFilter: {
                                            timeRange: {
                                                from: "".concat(fromDate, "T00:00:00Z"),
                                                to: "".concat(toDate, "T23:59:59Z"),
                                            },
                                            mosaickingOrder: "leastCC",
                                            maxCloudCoverage: 30,
                                        },
                                    },
                                ],
                            },
                            output: {
                                width: 1,
                                height: 1,
                                responses: [
                                    {
                                        identifier: "default",
                                        format: {
                                            type: "application/json",
                                        },
                                    },
                                ],
                            },
                            evalscript: NDVI_EVALSCRIPT,
                        }, {
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                Accept: "image/tiff",
                                "Content-Type": "application/json",
                            },
                            responseType: "arraybuffer",
                        })];
                case 3:
                    response = _d.sent();
                    responseBuffer = Buffer.isBuffer(response.data)
                        ? response.data
                        : Buffer.from(response.data);
                    arrayBuffer = responseBuffer.buffer.slice(responseBuffer.byteOffset, responseBuffer.byteOffset + responseBuffer.byteLength);
                    return [4 /*yield*/, (0, geotiff_1.fromArrayBuffer)(arrayBuffer)];
                case 4:
                    tiff = _d.sent();
                    return [4 /*yield*/, tiff.getImage()];
                case 5:
                    image = _d.sent();
                    return [4 /*yield*/, image.readRasters({ interleave: true })];
                case 6:
                    raster = _d.sent();
                    ndvi = Number(raster[0]);
                    return [2 /*return*/, {
                            ndvi: Number.isFinite(ndvi) ? ndvi : null,
                            date: null,
                        }];
                case 7:
                    error_1 = _d.sent();
                    if (axios_1.default.isAxiosError(error_1)) {
                        console.error("Copernicus Process API error:", {
                            status: (_a = error_1.response) === null || _a === void 0 ? void 0 : _a.status,
                            data: (_b = error_1.response) === null || _b === void 0 ? void 0 : _b.data,
                            url: (_c = error_1.config) === null || _c === void 0 ? void 0 : _c.url,
                        });
                    }
                    throw error_1;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getFieldNDVI = getFieldNDVI;
