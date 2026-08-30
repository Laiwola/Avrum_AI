import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { getEnv, loadEnvironment } from "./config/env.js";
import { errorHandler } from "./utils/errors.js";
import { requestIdMiddleware, requestLoggerMiddleware } from "./middleware/request.js";
import healthRoutes from "./routes/health.js";
import authRoutes from "./routes/auth.js";
import meRoutes from "./routes/me.js";
import onboardingRoutes from "./routes/onboarding.js";
import { logger } from "./utils/logger.js";

export function createApp(): express.Application {
  loadEnvironment();
  const app = express();
  const env = getEnv();

  // Middleware: Request tracking
  app.use(requestIdMiddleware);
  app.use(requestLoggerMiddleware);

  // Middleware: Body parsing
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Middleware: CORS
  app.use(
    cors({
      // origin: env.CORS_ALLOWED_ORIGINS,
      origin:"*",
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      optionsSuccessStatus: 200,
    })
  );

  // Middleware: Security headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  // Routes
  app.use("/", healthRoutes);
  app.use("/auth", authRoutes);
  app.use("/v1/me", meRoutes);
  app.use("/v1/onboarding", onboardingRoutes);

  app.use("/api/v1", (req: Request, res: Response, next: NextFunction) => {
    logger.info(`API request to ${req.path}`, { method: req.method });
    next();
  });
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/me", meRoutes);
  app.use("/api/v1/onboarding", onboardingRoutes);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      error: {
        code: "not_found",
        message: "Route not found",
        requestId: res.getHeader("X-Request-ID"),
      },
    });
  });

  // Error handler (must be last)
  app.use(errorHandler);

  return app;
}
