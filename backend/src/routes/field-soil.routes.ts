import { Router } from "express";
import { getFieldSoil } from "../controllers/field-soil.controller";
import {
  requireAuth
  
} from "../middleware/auth.js";


const router = Router();

router.get(
  "/:fieldId/soil",
  requireAuth,
  getFieldSoil
);

export default router;