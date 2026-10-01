import { Router } from "express";
import {
  createField,
  getFields,
  getField,
  updateField,
  deleteField,
} from "../controllers/field.controller.js";

import {
  requireAuth
  
} from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, createField);

router.get("/", requireAuth,getFields);

router.get("/:fieldId", requireAuth, getField);

router.patch("/:fieldId", requireAuth, updateField);

router.delete("/:fieldId", requireAuth, deleteField);

export default router;