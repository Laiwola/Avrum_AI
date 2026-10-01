import { Request, Response } from "express";
import { getFieldIntelligence } from "../services/field-intelligence.service";
import {
  AuthenticatedRequest,
} from "../middleware/auth.js";

export async function getFieldIntelligenceController(
   req: AuthenticatedRequest,
  res: Response
) {
  try {
     if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId= req.user._id.toString();
    const { fieldId } = req.params;

    const data = await getFieldIntelligence(
      fieldId,
      userId
    );

    return res.status(200).json({
      message:
        "Field intelligence retrieved successfully.",
      data,
    });
  } catch (error: any) {
    console.error(
      "Field intelligence error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve field intelligence.",
    });
  }
}