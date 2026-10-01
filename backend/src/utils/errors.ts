import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(422, "validation_error", message, details);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(401, "unauthenticated", message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(403, "forbidden", message);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, "not_found", `${resource} not found`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, "conflict", message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor() {
    super(429, "rate_limited", "Too many requests. Please try again later.");
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

export class QuotaExceededError extends AppError {
  constructor() {
    super(429, "quota_exceeded", "Quota exceeded");
    Object.setPrototypeOf(this, QuotaExceededError.prototype);
  }
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown> | { field: string; message: string }[];
    requestId: string;
  };
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function formatZodError(error: ZodError): Record<string, unknown> {
  const details: { field: string; message: string }[] = [];
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? "form");
    if (!details.find((d) => d.field === field)) {
      details.push({ field, message: issue.message });
    }
  }
  return { details };
}

export function createErrorResponse(
  error: AppError | Error,
  requestId: string
): ErrorResponse {
  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        requestId,
      },
    };
  }

  return {
    error: {
      code: "internal_error",
      message: "An unexpected error occurred",
      requestId,
    },
  };
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = res.getHeader("X-Request-ID") as string;

  if (err instanceof AppError) {
    res.status(err.statusCode).json(createErrorResponse(err, requestId));
    return;
  }

  if (err instanceof ZodError) {
    const validationError = new ValidationError("Validation failed", formatZodError(err));
    res.status(validationError.statusCode).json(createErrorResponse(validationError, requestId));
    return;
  }

  console.error("Unexpected error:", err);
  res.status(500).json(
    createErrorResponse(new AppError(500, "internal_error", "Internal server error"), requestId)
  );
};
