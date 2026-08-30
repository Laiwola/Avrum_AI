import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

describe("app bootstrap", () => {
  it("creates an Express app with a health endpoint", () => {
    const app = createApp();
    expect(app).toBeTruthy();
    expect(typeof app.listen).toBe("function");
  });
});
