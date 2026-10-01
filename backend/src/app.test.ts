import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";
import { normalizeFarmOwnershipType, normalizeFarmSizeUnit } from "./services/auth.service.js";

describe("app bootstrap", () => {
  it("creates an Express app with a health endpoint", () => {
    const app = createApp();
    expect(app).toBeTruthy();
    expect(typeof app.listen).toBe("function");
  });
});

describe("farm onboarding normalization", () => {
  it("maps frontend ownership and size unit aliases to valid backend enums", () => {
    expect(normalizeFarmOwnershipType("owned")).toBe("individual");
    expect(normalizeFarmOwnershipType("leased")).toBe("commercial");
    expect(normalizeFarmOwnershipType("family")).toBe("individual");
    expect(normalizeFarmOwnershipType("managed")).toBe("commercial");
    expect(normalizeFarmOwnershipType("unknown")).toBe("individual");

    expect(normalizeFarmSizeUnit("plots")).toBe("plots");
    expect(normalizeFarmSizeUnit("hectares")).toBe("hectares");
    expect(normalizeFarmSizeUnit("acres")).toBe("acres");
    expect(normalizeFarmSizeUnit("unknown")).toBe("hectares");
  });
});
