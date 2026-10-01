import { Router } from "express";

import {
  getFieldVegetation,getFieldVegetationMap
} from "../controllers/field-monitoring.controller";

// import { authenticate } from "../middleware/auth.middleware";
import {
  requireAuth
  
} from "../middleware/auth.js";


const router = Router();

router.get(
  "/:fieldId/vegetation",
    requireAuth,
  getFieldVegetation
);
router.get(
  "/:fieldId/vegetation/map",
  requireAuth,
  getFieldVegetationMap
);

export default router;