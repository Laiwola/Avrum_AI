import mongoose from "mongoose";
import { Fields } from "../models/field.model";
import {
  calculateAreaHectares,
  calculateCentroid,
  validatePolygonCoordinates,
} from "../utils/geo.utils";

interface CreateFieldInput {
  userId: string;
  name: string;
  coordinates: number[][][];
}

export async function createField({
  userId,
  name,
  coordinates,
}: CreateFieldInput) {
  validatePolygonCoordinates(coordinates);

  const areaHectares = calculateAreaHectares(coordinates);

  const centroid = calculateCentroid(coordinates);

  const field = await Fields.create({
    userId,
    name,
    boundary: {
      type: "Polygon",
      coordinates,
    },
    areaHectares,
    centroid,
  });

  return field;
}

export async function getUserFields(userId: string) {
  return Fields.find({
    userId,
  }).sort({
    createdAt: -1,
  });
}

export async function getFieldById(
  fieldId: string,
  userId: string
) {
  if (!mongoose.Types.ObjectId.isValid(fieldId)) {
    throw new Error("Invalid field ID.");
  }

  const field = await Fields.findOne({
    _id: fieldId,
    userId,
  });

  if (!field) {
    throw new Error("Field not found.");
  }

  return field;
}

export async function updateField(
  fieldId: string,
  userId: string,
  data: {
    name?: string;
    coordinates?: number[][][];
  }
) {
  const field = await getFieldById(fieldId, userId);

  if (data.name !== undefined) {
    field.name = data.name.trim();
  }

  if (data.coordinates) {
    validatePolygonCoordinates(data.coordinates);

    field.boundary = {
      type: "Polygon",
      coordinates: data.coordinates,
    };

    field.areaHectares = calculateAreaHectares(
      data.coordinates
    );

    field.centroid = calculateCentroid(
      data.coordinates
    );
  }

  await field.save();

  return field;
}

export async function deleteField(
  fieldId: string,
  userId: string
) {
  const field = await getFieldById(fieldId, userId);

  await field.deleteOne();

  return field;
}