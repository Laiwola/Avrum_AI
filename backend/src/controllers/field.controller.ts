import { Request, Response } from "express";
import * as fieldService from "../services/field.service";
import {
  AuthenticatedRequest,
} from "../middleware/auth.js";

export async function createField(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId= req.user._id.toString();

    const { name, coordinates } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Field name is required.",
      });
    }

    if (!coordinates) {
      return res.status(400).json({
        message: "Field coordinates are required.",
      });
    }

    const field = await fieldService.createField({
      userId,
      name,
      coordinates,
    });

    return res.status(201).json({
      message: "Field created successfully.",
      field,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function getFields(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId=req.user._id.toString();
    const fields = await fieldService.getUserFields(userId);

    return res.status(200).json({
      fields,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

export async function getField(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId=req.user._id.toString();

    const field = await fieldService.getFieldById(
      req.params.fieldId,
      userId
    );

    return res.status(200).json({
      field,
    });
  } catch (error: any) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

export async function updateField(
   req: AuthenticatedRequest,
  res: Response
) {
  try {
   if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}

   const userId=req.user._id.toString();

    const field = await fieldService.updateField(
      req.params.fieldId,
      userId,
      req.body
    );

    return res.status(200).json({
      message: "Field updated successfully.",
      field,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

export async function deleteField(
 req: AuthenticatedRequest,
  res: Response
) {
  try {
   if (!req.user) {
  return res.status(401).json({ message: "Unauthorized" });
}

    const userId=req.user._id.toString();

    await fieldService.deleteField(
      req.params.fieldId,
      userId
    );

    return res.status(200).json({
      message: "Field deleted successfully.",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message,
    });
  }
}