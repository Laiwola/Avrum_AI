/**
 * Satellite Monitoring — shared domain types.
 *
 * These mirror the backend `Field` model (see backend/src/models/Field.ts)
 * plus the new `SatellitePass` resource this feature introduces.
 *
 * This file is the contract: the backend should return JSON matching these
 * shapes, and `src/lib/satellite/service.ts` documents exactly which
 * endpoint each function will call once it exists.
 */

/** Matches backend `IField["boundary"]` (GeoJSON). */
export type FieldBoundary = {
  type: "Polygon" | "MultiPolygon" | "Point";
  coordinates: number[][][] | number[][];
};

export type Field = {
  id: string;
  farmId: string;
  farmName: string;
  name: string;
  boundary: FieldBoundary | null;
  areaHectares?: number;
};

export type SatelliteIndexType = "ndvi" | "ndmi" | "stress";

export const SATELLITE_INDEX_LABEL: Record<SatelliteIndexType, string> = {
  ndvi: "NDVI (vegetation)",
  ndmi: "NDMI (moisture)",
  stress: "Stress index",
};

/**
 * A per-cell value grid for one index, one pass. Cells are a coarse
 * abstraction over the raw raster: rows x cols values in [0, 1], read
 * left-to-right, top-to-bottom across the field's bounding box.
 * The real satellite pipeline can populate this by downsampling the
 * source raster server-side — the frontend never needs raw imagery.
 */
export type IndexGrid = {
  rows: number;
  cols: number;
  /** length === rows * cols, each value in [0, 1] */
  values: number[];
};

export type SatellitePass = {
  id: string;
  fieldId: string;
  /** ISO 8601 timestamp of the satellite pass */
  capturedAt: string;
  /** Mean value per index across the field, in [0, 1], for history charts */
  meanIndices: Record<SatelliteIndexType, number>;
  /** Per-cell grids for the index viewer, one per index type */
  grids: Record<SatelliteIndexType, IndexGrid>;
  /** Source of this pass — lets the UI (and backend, later) distinguish real vs. simulated data */
  source: "mock" | "sentinel-2" | "planet";
};
