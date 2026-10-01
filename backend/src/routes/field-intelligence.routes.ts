import { Router } from "express";

import {
  getFieldIntelligenceController,
} from "../controllers/field-intelligence.controller";

import {
  requireAuth
  
} from "../middleware/auth.js";


const router = Router();

router.get(
  "/:fieldId/intelligence",
    requireAuth,
  getFieldIntelligenceController
);

export default router;