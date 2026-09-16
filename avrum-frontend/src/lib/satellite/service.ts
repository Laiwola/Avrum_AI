/**
 * Satellite Monitoring — data service.
 *
 * Every function here is written the way it will look once the backend
 * exists: it returns a Promise of the exact shape defined in `./types`.
 * Right now the implementation reads/writes the in-memory mock store from
 * `./mock-data`. To integrate the real backend, replace the body of each
 * function with the commented `apiClient` call below it — callers
 * (`src/hooks/use-satellite.ts`) do not need to change.
 *
 * See SATELLITE_MONITORING_CONTRACT.md at the repo root for the full
 * endpoint spec (request/response JSON, error cases, auth).
 */
import { apiClient } from "@/lib/api-client";
import type { Field, SatellitePass } from "./types";
import { MOCK_FIELDS, appendMockPass, getMockPasses } from "./mock-data";

const MOCK_LATENCY_MS = 350;

function delay<T>(value: T, ms = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/**
 * GET /api/fields
 * Returns every field the current user can see, across all their farms.
 */
export async function listFields(): Promise<Field[]> {
  return delay(MOCK_FIELDS);
  // return apiClient.get<{ success: boolean; data: Field[] }>("/api/fields").then((r) => r.data.data);
}

/**
 * GET /api/fields/:fieldId/satellite-passes
 * Returns the pass history for one field, oldest first.
 * 404 (or an empty array) if the field has no boundary saved yet.
 */
export async function getFieldPasses(fieldId: string): Promise<SatellitePass[]> {
  const field = MOCK_FIELDS.find((f) => f.id === fieldId);
  if (!field) return delay([]);
  return delay(getMockPasses(field));
  // return apiClient
  //   .get<{ success: boolean; data: SatellitePass[] }>(`/api/fields/${fieldId}/satellite-passes`)
  //   .then((r) => r.data.data);
}

/**
 * POST /api/fields/:fieldId/satellite-passes/refresh
 * Requests a new satellite pass for the field (dispatches an async job
 * against Sentinel Hub / Planet server-side). Returns the newest pass
 * once available. For a long-running job, the real endpoint may instead
 * return `202 { jobId }` and the frontend would poll — see the contract
 * doc for both options.
 */
export async function refreshImagery(fieldId: string): Promise<SatellitePass> {
  const field = MOCK_FIELDS.find((f) => f.id === fieldId);
  if (!field) throw new Error("Field not found");
  return delay(appendMockPass(field), 900);
  // return apiClient
  //   .post<{ success: boolean; data: SatellitePass }>(`/api/fields/${fieldId}/satellite-passes/refresh`)
  //   .then((r) => r.data.data);
}
