import { Request, Response } from "express";
import { Fields } from "../models/field.model";
import {
  createFieldObservation,
  getFieldObservations,
} from "../services/field-observation.service";
import {
  AuthenticatedRequest,
} from "../middleware/auth.js";


export async function saveFieldObservation(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
     if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id.toString();
    const { fieldId } = req.params;

    const field = await Fields.findOne({
      _id: fieldId,
      userId,
    });

    if (!field) {
      return res.status(404).json({
        message: "Field not found.",
      });
    }

    const observation =
      await createFieldObservation({
        fieldId,
        userId,

        ndvi: req.body.ndvi,

        temperature:
          req.body.temperature,

        humidity:
          req.body.humidity,

        rainfall:
          req.body.rainfall,

        moisture0To1cm:
          req.body.moisture0To1cm,

        moisture1To3cm:
          req.body.moisture1To3cm,

        moisture3To9cm:
          req.body.moisture3To9cm,

        moisture9To27cm:
          req.body.moisture9To27cm,

        observedAt: req.body.observedAt
          ? new Date(req.body.observedAt)
          : new Date(),
      });

    return res.status(201).json({
      message:
        "Field observation saved successfully.",
      data: observation,
    });
  } catch (error: any) {
    console.error(
      "Save field observation error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to save field observation.",
    });
  }
}

export async function getFieldObservationHistory(
  req: Request,
  res: Response
) {
  try {
    const userId = (req as any).user.id;
    const { fieldId } = req.params;

    const observations =
      await getFieldObservations(
        fieldId,
        userId
      );

    return res.status(200).json({
      message:
        "Field observation history retrieved successfully.",
      data: observations,
    });
  } catch (error: any) {
    console.error(
      "Get field observations error:",
      error
    );

    return res.status(500).json({
      message:
        error.message ||
        "Failed to retrieve field observations.",
    });
  }
}