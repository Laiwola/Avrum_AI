import { Request, Response } from "express";
import { getFieldWeatherData } from "../services/field-weather.service";
import { AuthenticatedRequest } from "../middleware/auth.js";
export async function getFieldWeatherController(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id.toString();
    const { fieldId } = req.params;

    const data = await getFieldWeatherData(
      fieldId,
      userId
    );

    return res.status(200).json({
      message: "Field weather data retrieved successfully.",
      data,
    });
  } catch (error: any) {
    console.error("Field weather error:", error);

    return res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve field weather data.",
    });
  }
}