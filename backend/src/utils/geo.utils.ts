import { area } from "@turf/area";
import { centroid } from "@turf/centroid";
import { polygon } from "@turf/helpers";

export interface Coordinate {
  longitude: number;
  latitude: number;
}

export interface GeoJsonPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export function validatePolygonCoordinates(
  coordinates: number[][][]
): void {
  if (!coordinates || coordinates.length !== 1) {
    throw new Error("Only single-ring polygons are supported.");
  }

  const ring = coordinates[0];

  if (ring.length < 4) {
    throw new Error("A polygon must contain at least 4 coordinate points.");
  }

  const first = ring[0];
  const last = ring[ring.length - 1];

  if (first[0] !== last[0] || first[1] !== last[1]) {
    throw new Error("Polygon must be closed.");
  }

  for (const point of ring) {
    if (point.length !== 2) {
      throw new Error(
        "Each coordinate must contain [longitude, latitude]."
      );
    }

    const [longitude, latitude] = point;

    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude.");
    }

    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude.");
    }
  }
}

export function calculateAreaHectares(
  coordinates: number[][][]
): number {
  const fieldPolygon = polygon(coordinates);

  const areaSquareMeters = area(fieldPolygon);

  return Number((areaSquareMeters / 10000).toFixed(2));
}

export function calculateCentroid(
  coordinates: number[][][]
): Coordinate {
  const fieldPolygon = polygon(coordinates);

  const center = centroid(fieldPolygon);

  const [longitude, latitude] = center.geometry.coordinates;

  return {
    longitude,
    latitude,
  };
}