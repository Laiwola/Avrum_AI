import mongoose from "mongoose";
import { getEnv, loadEnvironment } from "./env.js";

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  loadEnvironment();

  if (isConnected) {
    console.log("✓ Database already connected");
    return;
  }

  try {
    const env = getEnv();
    const mongoUri = env.MONGODB_URI;
    const dbName = env.MONGODB_DB_NAME;

    console.log("🔌 Attempting to connect to MongoDB...");
    
    await Promise.race([
      mongoose.connect(mongoUri, {
        dbName,
        connectTimeoutMS: 5000,
        socketTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
      }),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error("MongoDB connection timeout - connection took too long")), 8000);
      }),
    ]);

    isConnected = true;
    console.log("✓ Connected to MongoDB successfully");
  } catch (error) {
    console.warn("⚠ MongoDB connection unavailable; continuing in degraded startup mode.");
    console.warn("Error details:", error instanceof Error ? error.message : String(error));
    isConnected = false;
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("✓ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
  }
}

export function getDatabaseConnection(): typeof mongoose {
  if (!isConnected) {
    throw new Error("Database not connected. Call connectDatabase() first.");
  }
  return mongoose;
}
