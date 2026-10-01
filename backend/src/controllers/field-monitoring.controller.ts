import { Response } from "express";
import {
  getFieldVegetationData
} from "../services/field-monitoring.service";
import {
  getFieldVegetationMap as getFieldVegetationMapData
} from "../services/field-monitoring.service";
import { AuthenticatedRequest } from "../middleware/auth.js";

export async function getFieldVegetation(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id.toString();

    const { fieldId } = req.params;

    const data =
      await getFieldVegetationData(
        fieldId,
        userId
      );

    return res.status(200).json({
      message:
        "Field vegetation data retrieved successfully.",
      data,
    });
  } catch (error: any) {
    console.error(
      "Field vegetation error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve vegetation data.",
    });
  }
}

export async function getFieldVegetationMap(
  req: AuthenticatedRequest,
  res: Response
) {
  try {

    const { fieldId } =
      req.params;

    const userId =
      req.user?._id.toString();

    if (!userId) {
      return res.status(401).json({
        message:
          "Authentication required.",
      });
    }

    const data =
      await getFieldVegetationMapData(
        fieldId,
        userId
      );

    return res.status(200).json({
      message:
        "Vegetation map generated successfully.",

      data,
    });

  } catch (error) {

    console.error(
      "Vegetation map error:",
      error
    );

    if (
      error instanceof Error &&
      error.message ===
        "Field not found."
    ) {
      return res.status(404).json({
        message:
          "Field not found.",
      });
    }

    return res.status(500).json({
      message:
        "Failed to generate vegetation map.",
    });
  }
}