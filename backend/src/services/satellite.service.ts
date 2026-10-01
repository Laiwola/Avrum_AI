import axios from "axios";
import { getSentinelAccessToken } from "./sentinel-auth.service";

interface NDVIResult {
  ndvi: number | null;
  date: string | null;
}

const NDVI_STATS_EVALSCRIPT = `
//VERSION=3

function setup() {
  return {
    input: [
      "B04",
      "B08",
      "dataMask"
    ],

    output: [
      {
        id: "ndvi",
        bands: 1,
        sampleType: "FLOAT32"
      },
      {
        id: "dataMask",
        bands: 1
      }
    ]
  };
}

function evaluatePixel(sample) {

  // Reject pixels where Sentinel Hub has no source data
  if (sample.dataMask === 0) {
    return {
      ndvi: [0],
      dataMask: [0]
    };
  }

  const denominator =
    sample.B08 + sample.B04;

  if (denominator === 0) {
    return {
      ndvi: [0],
      dataMask: [0]
    };
  }

  const ndvi =
    (sample.B08 - sample.B04) /
    denominator;

  return {
    ndvi: [ndvi],
    dataMask: [1]
  };
}
`;

export async function getFieldNDVI(
  coordinates: number[][][],
  fromDate: string,
  toDate: string
): Promise<NDVIResult> {

  const token = await getSentinelAccessToken();

  const url =
    "https://sh.dataspace.copernicus.eu/statistics/v1";

  const requestBody = {
    input: {
      bounds: {
        geometry: {
          type: "Polygon",
          coordinates,
        },

        properties: {
          crs:
            "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
      },

      data: [
        {
          type: "sentinel-2-l2a",

          dataFilter: {
            timeRange: {
              from: `${fromDate}T00:00:00Z`,
              to: `${toDate}T23:59:59Z`,
            },

            mosaickingOrder: "mostRecent",

            maxCloudCoverage: 100,
          },
        },
      ],
    },

    aggregation: {
      timeRange: {
        from: `${fromDate}T00:00:00Z`,
        to: `${toDate}T23:59:59Z`,
      },

      aggregationInterval: {
        of: "P10D",
      },

      evalscript: NDVI_STATS_EVALSCRIPT,

      resx: 20,
      resy: 20,
    },
  };

  // console.log(
  //   "Sentinel request:",
  //   JSON.stringify(requestBody, null, 2)
  // );

  try {

    const response = await axios.post(
      url,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        timeout: 30000,
      }
    );

    // console.log(
    //   "Copernicus Statistical API response:",
    //   JSON.stringify(
    //     response.data,
    //     null,
    //     2
    //   )
    // );

    const data = response.data;

    if (
      !data?.data ||
      !Array.isArray(data.data)
    ) {
      return {
        ndvi: null,
        date: null,
      };
    }

    // Search from newest interval backwards.
    for (
      let i = data.data.length - 1;
      i >= 0;
      i--
    ) {

      const interval =
        data.data[i];

      const stats =
        interval?.outputs
          ?.ndvi
          ?.bands
          ?.B0
          ?.stats;

      // console.log(
      //   "NDVI interval:",
      //   JSON.stringify(
      //     interval,
      //     null,
      //     2
      //   )
      // );

      if (
        stats &&
        typeof stats.mean === "number" &&
        Number.isFinite(stats.mean) &&
        stats.sampleCount > 0
      ) {

        return {
          ndvi: Number(
            stats.mean.toFixed(4)
          ),

          date:
            interval.interval?.to ||
            interval.interval?.from ||
            null,
        };
      }
    }

    return {
      ndvi: null,
      date: null,
    };

  } catch (error) {

    if (axios.isAxiosError(error)) {

      // console.error(
      //   "Copernicus Statistical API error:",
      //   {
      //     status:
      //       error.response?.status,

      //     data:
      //       error.response?.data,

      //     url:
      //       error.config?.url,
      //   }
      // );
    }

    throw error;
  }
}


interface SpatialNDVIMapResult {
  imageBase64: string;
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

const NDVI_MAP_EVALSCRIPT = `
//VERSION=3

function setup() {
  return {
    input: [
      "B04",
      "B08",
      "SCL",
      "dataMask"
    ],
    output: {
      bands: 4,
      sampleType: "UINT8"
    }
  };
}

function evaluatePixel(sample) {

  // Sentinel-2 SCL classes
  // 3  = cloud shadow
  // 6  = water
  // 8  = cloud medium probability
  // 9  = cloud high probability
  // 10 = cirrus
  // 11 = snow / ice

  const invalidSCL =
    sample.SCL === 3 ||
    sample.SCL === 6 ||
    sample.SCL === 8 ||
    sample.SCL === 9 ||
    sample.SCL === 10 ||
    sample.SCL === 11;

  // No data or invalid pixel
  if (sample.dataMask === 0 || invalidSCL) {
    return [0, 0, 0, 0];
  }

  const denominator =
    sample.B08 + sample.B04;

  if (denominator === 0) {
    return [0, 0, 0, 0];
  }

  const ndvi =
    (sample.B08 - sample.B04) /
    denominator;

  if (!Number.isFinite(ndvi)) {
    return [0, 0, 0, 0];
  }

  /*
    Vegetation classification

    NDVI < 0.30
      RED

    NDVI 0.30 - 0.60
      YELLOW

    NDVI > 0.60
      GREEN
  */

  if (ndvi < 0.30) {
    return [255, 0, 0, 200];
  }

  if (ndvi < 0.60) {
    return [255, 255, 0, 200];
  }

  return [0, 200, 0, 200];
}
`;

function getPolygonBounds(
  coordinates: number[][][]
) {
  if (
    !coordinates ||
    !coordinates.length ||
    !coordinates[0] ||
    !coordinates[0].length
  ) {
    throw new Error(
      "Invalid field polygon coordinates."
    );
  }

  const ring = coordinates[0];

  const longitudes: number[] = [];
  const latitudes: number[] = [];

  for (const point of ring) {
    if (
      !Array.isArray(point) ||
      point.length < 2
    ) {
      continue;
    }

    const longitude = Number(point[0]);
    const latitude = Number(point[1]);

    if (
      !Number.isFinite(longitude) ||
      !Number.isFinite(latitude)
    ) {
      continue;
    }

    longitudes.push(longitude);
    latitudes.push(latitude);
  }

  if (
    longitudes.length === 0 ||
    latitudes.length === 0
  ) {
    throw new Error(
      "Field polygon contains no valid coordinates."
    );
  }

  return {
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    west: Math.min(...longitudes),
  };
}

export async function getFieldNDVIMap(
  coordinates: number[][][],
  fromDate: string,
  toDate: string
): Promise<SpatialNDVIMapResult> {

  const token =
    await getSentinelAccessToken();

  const url =
    "https://sh.dataspace.copernicus.eu/process/v1";

  const requestBody = {
    input: {
      bounds: {
        geometry: {
          type: "Polygon",
          coordinates,
        },

        properties: {
          crs:
            "http://www.opengis.net/def/crs/OGC/1.3/CRS84",
        },
      },

      data: [
        {
          type: "sentinel-2-l2a",

          dataFilter: {
            timeRange: {
              from: `${fromDate}T00:00:00Z`,
              to: `${toDate}T23:59:59Z`,
            },

            mosaickingOrder: "leastCC",

            maxCloudCoverage: 100,
          },
        },
      ],
    },

    output: {
      width: 512,
      height: 512,

      responses: [
        {
          identifier: "default",

          format: {
            type: "image/png",
          },
        },
      ],
    },

    evalscript:
      NDVI_MAP_EVALSCRIPT,
  };

  try {

    const response =
      await axios.post(
        url,
        requestBody,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,

            "Content-Type":
              "application/json",

            Accept:
              "image/png",
          },

          responseType:
            "arraybuffer",

          timeout: 60000,
        }
      );

    const imageBase64 =
      Buffer.from(
        response.data
      ).toString("base64");

    const bounds =
      getPolygonBounds(
        coordinates
      );

    return {
      imageBase64,
      bounds,
    };

  } catch (error) {

    if (axios.isAxiosError(error)) {

      console.error(
        "Copernicus Process API error:",
        {
          status:
            error.response?.status,

          data:
            error.response?.data
              ? Buffer.from(
                  error.response.data
                ).toString()
              : undefined,

          url:
            error.config?.url,
        }
      );
    }

    throw error;
  }
}