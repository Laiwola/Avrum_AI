import { Request, Response, NextFunction } from "express";
import { generateRequestId } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

type RequestWithId = Request & { id?: string };

export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = generateRequestId();
  res.setHeader("X-Request-ID", requestId);
  (req as RequestWithId).id = requestId;
  next();
};

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const requestId = (req as RequestWithId).id;
  const startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`, {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
    });
  });

  next();
};
