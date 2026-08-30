import { loadEnvironment } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { createApp } from "./app.js";
import { logger } from "./utils/logger.js";

async function startServer(): Promise<void> {
  try {
    // Load environment variables
    const env = loadEnvironment();
    logger.info("Environment loaded successfully");

    // Connect to database
    await connectDatabase();

    // Create Express app
    const app = createApp();

    // Start listening
    const port = env.PORT;
    const server = app.listen(port, () => {
      logger.info(`🚀 Server running on port ${port}`);
      logger.info(`Environment: ${env.NODE_ENV}`);
      logger.info(`Health check: GET http://localhost:${port}/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}, shutting down gracefully...`);

      server.close(async () => {
        logger.info("Server closed");
        await disconnectDatabase();
        process.exit(0);
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

startServer();
