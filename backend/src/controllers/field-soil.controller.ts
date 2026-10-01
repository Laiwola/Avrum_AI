import { Request, Response } from "express";
import { getFieldSoilData } from "../services/field-soil.service";
import {
  AuthenticatedRequest,
} from "../middleware/auth.js";

export async function getFieldSoil(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
     if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId= req.user._id.toString();
    const { fieldId } = req.params;

    const data = await getFieldSoilData(
      fieldId,
      userId
    );

    return res.status(200).json({
      message: "Field soil data retrieved successfully.",
      data,
    });
  } catch (error: any) {
    console.error("Field soil error:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve field soil data.",
    });
  }
}