import { Fields } from "../models/field.model";
import { getFieldWeather } from "./weather.service.js";

export async function getFieldWeatherData(
  fieldId: string,
  userId: string
): Promise<{
  field: {
    id: string;
    name: string;
    areaHectares: number;
  };
  weather: Awaited<ReturnType<typeof getFieldWeather>>;
}> {
  const field = await Fields.findOne({
    _id: fieldId,
    userId,
  });

  if (!field) {
    throw new Error("Field not found.");
  }

  const weather = await getFieldWeather(
    field.centroid.latitude,
    field.centroid.longitude
  );

  return {
    field: {
      id: String(field._id),
      name: field.name,
      areaHectares: field.areaHectares,
    },

    weather,
  };
}