import type { Field, IndexGrid, SatelliteIndexType, SatellitePass } from "./types";

/** Small deterministic PRNG so mock data is stable across renders/reloads within a session seed. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GRID_ROWS = 8;
const GRID_COLS = 12;

function makeGrid(rng: () => number, base: number, noise: number): IndexGrid {
  const values = Array.from({ length: GRID_ROWS * GRID_COLS }, () => {
    const v = base + (rng() - 0.5) * noise;
    return Math.min(1, Math.max(0, v));
  });
  return { rows: GRID_ROWS, cols: GRID_COLS, values };
}

/** Demo farms/fields so the Satellite Monitoring page has something to select from
 *  before the backend exposes real `/farms` and `/fields` endpoints. */
export const MOCK_FIELDS: Field[] = [
  {
    id: "field-1",
    farmId: "farm-1",
    farmName: "Adeyemi Family Farm",
    name: "North Maize Block",
    boundary: {
      type: "Polygon",
      coordinates: [
        [
          [3.3792, 6.5244],
          [3.3822, 6.5244],
          [3.3822, 6.5268],
          [3.3792, 6.5268],
          [3.3792, 6.5244],
        ],
      ],
    },
    areaHectares: 4.2,
  },
  {
    id: "field-2",
    farmId: "farm-1",
    farmName: "Adeyemi Family Farm",
    name: "River Cassava Plot",
    boundary: {
      type: "Polygon",
      coordinates: [
        [
          [3.3852, 6.5204],
          [3.3878, 6.5204],
          [3.3878, 6.5226],
          [3.3852, 6.5226],
          [3.3852, 6.5204],
        ],
      ],
    },
    areaHectares: 2.8,
  },
  {
    id: "field-3",
    farmId: "farm-2",
    farmName: "Okoro Cooperative",
    name: "East Rice Paddy",
    boundary: null,
    areaHectares: 6.1,
  },
];

/** Fields that already have a saved boundary can receive satellite passes. */
export function fieldSupportsSatellite(field: Field): boolean {
  return field.boundary !== null;
}

/** In-memory pass history, seeded once per field, mutable via `appendMockPass`. */
const passStore = new Map<string, SatellitePass[]>();

function seedPassesForField(field: Field): SatellitePass[] {
  const rng = mulberry32(hashString(field.id));
  const passes: SatellitePass[] = [];
  const now = Date.now();
  const passCount = 6;

  // Trend the field's health gently up or down over the last ~60 days so
  // the history chart shows a believable trajectory, not just noise.
  const trend = rng() > 0.5 ? 1 : -1;

  for (let i = passCount - 1; i >= 0; i -= 1) {
    const daysAgo = i * 10;
    const progress = (passCount - 1 - i) / (passCount - 1);
    const ndviBase = clamp01(0.55 + trend * 0.15 * progress + (rng() - 0.5) * 0.05);
    const ndmiBase = clamp01(0.5 + trend * 0.1 * progress + (rng() - 0.5) * 0.06);
    const stressBase = clamp01(0.3 - trend * 0.12 * progress + (rng() - 0.5) * 0.05);

    passes.push({
      id: `${field.id}-pass-${i}`,
      fieldId: field.id,
      capturedAt: new Date(now - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      meanIndices: { ndvi: ndviBase, ndmi: ndmiBase, stress: stressBase },
      grids: {
        ndvi: makeGrid(rng, ndviBase, 0.35),
        ndmi: makeGrid(rng, ndmiBase, 0.3),
        stress: makeGrid(rng, stressBase, 0.3),
      },
      source: "mock",
    });
  }

  return passes;
}

export function getMockPasses(field: Field): SatellitePass[] {
  if (!passStore.has(field.id)) {
    passStore.set(field.id, fieldSupportsSatellite(field) ? seedPassesForField(field) : []);
  }
  return passStore.get(field.id)!;
}

/** Simulates a new satellite pass arriving (what "Refresh imagery" triggers). */
export function appendMockPass(field: Field): SatellitePass {
  const existing = getMockPasses(field);
  const rng = mulberry32(hashString(field.id) + existing.length + (Date.now() % 1000));
  const last = existing[existing.length - 1];
  const jitter = () => clamp01((last?.meanIndices.ndvi ?? 0.55) + (rng() - 0.5) * 0.08);

  const ndviBase = jitter();
  const ndmiBase = clamp01((last?.meanIndices.ndmi ?? 0.5) + (rng() - 0.5) * 0.08);
  const stressBase = clamp01((last?.meanIndices.stress ?? 0.3) + (rng() - 0.5) * 0.08);

  const pass: SatellitePass = {
    id: `${field.id}-pass-${existing.length}`,
    fieldId: field.id,
    capturedAt: new Date().toISOString(),
    meanIndices: { ndvi: ndviBase, ndmi: ndmiBase, stress: stressBase },
    grids: {
      ndvi: makeGrid(rng, ndviBase, 0.35),
      ndmi: makeGrid(rng, ndmiBase, 0.3),
      stress: makeGrid(rng, stressBase, 0.3),
    },
    source: "mock",
  };

  passStore.set(field.id, [...existing, pass]);
  return pass;
}

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return h;
}

export type { SatelliteIndexType };
