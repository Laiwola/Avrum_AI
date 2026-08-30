import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth.js";
import { completeOnboarding, saveDraft } from "../services/auth.service.js";
import { onboardingCompleteSchema, onboardingDraftSchema } from "../validators/auth.js";

const router = Router();

function validateBody<T>(schema: z.ZodSchema<T>, req: Request): T {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

router.post("/draft", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(onboardingDraftSchema, req);
    const result = await saveDraft(String(req.user?._id), {
      step: body.step,
      data: body.data ?? {},
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/complete", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const body = validateBody(onboardingCompleteSchema, req);
    const result = await completeOnboarding(String(req.user?._id), body as Record<string, unknown>);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
