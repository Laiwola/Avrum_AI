import { Router } from "express";
import {
  getFieldWeatherController,
} from "../controllers/field-weather.controller";
import {
  requireAuth
  
} from "../middleware/auth.js";

const router = Router();

router.get(
  "/:fieldId/weather",
  requireAuth,
  getFieldWeatherController
);

export default router;