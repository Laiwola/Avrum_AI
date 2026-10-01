import { Fields } from "../models/field.model";
import { getFieldSoilMoisture } from "./weather.service";

export async function getFieldSoilData(
  fieldId: string,
  userId: string
) {
  const field = await Fields.findOne({
    _id: fieldId,
    userId,
  });

  if (!field) {
    throw new Error("Field not found.");
  }

  const soil = await getFieldSoilMoisture(
    field.centroid.latitude,
    field.centroid.longitude
  );

  return {
    field: {
      id: field._id,
      name: field.name,
      areaHectares: field.areaHectares,
    },

    soil,
  };
}