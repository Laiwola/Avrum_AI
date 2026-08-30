import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/auth.js";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
  verifyEmail,
} from "../services/auth.service.js";
import { getRequestContext } from "../services/auth.service.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function validateBody<T>(schema: z.ZodSchema<T>, req: Request): T {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(registerSchema, req);
    const result = await registerUser(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/verify-email", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(verifyEmailSchema, req);
    const result = await verifyEmail(body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(loginSchema, req);
    const context = getRequestContext(req);
    const result = await loginUser(body, context);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(refreshSchema, req);
    const context = getRequestContext(req);
    const result = await refreshToken(body, context);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization ?? "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    await logoutUser(String((req as any).user?._id ?? ""), token || undefined);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/forgot-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(forgotPasswordSchema, req);
    await forgotPassword(body);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.post("/reset-password", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(resetPasswordSchema, req);
    await resetPassword(body);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
