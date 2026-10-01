import { Router } from "express";

import {
  saveFieldObservation,
  getFieldObservationHistory,
} from "../controllers/field-observation.controller";

import {
  requireAuth
  
} from "../middleware/auth.js";

const router = Router();

router.post(
  "/:fieldId/observations",
    requireAuth,
  saveFieldObservation
);

router.get(
  "/:fieldId/observations",
    requireAuth,
  getFieldObservationHistory
);

export default router;