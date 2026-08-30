import { beforeAll, afterAll, beforeEach } from "vitest";
import { connectDatabase, disconnectDatabase } from "../src/config/database.js";

beforeAll(async () => {
  // Connect to test database before running tests
  try {
    await connectDatabase();
  } catch (error) {
    console.warn("Database connection skipped for tests:", error);
  }
});

afterAll(async () => {
  // Disconnect after all tests
  await disconnectDatabase();
});

beforeEach(() => {
  // Clear any test state before each test if needed
});
