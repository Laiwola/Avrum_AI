import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { changePassword, getCurrentUser, listSessions, revokeSession, updateProfile } from "../services/auth.service.js";
import { changePasswordSchema, updateProfileSchema } from "../validators/auth.js";

const router = Router();

function validateBody<T>(schema: z.ZodSchema<T>, req: Request): T {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

router.get("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getCurrentUser(String(req.user?._id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(updateProfileSchema, req);
    const result = await updateProfile(String(req.user?._id), body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/password", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(changePasswordSchema, req);
    await changePassword(String(req.user?._id), body.currentPassword, body.password);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.get("/sessions", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const result = await listSessions(String(req.user?._id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/sessions/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await revokeSession(String(req.user?._id), req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
