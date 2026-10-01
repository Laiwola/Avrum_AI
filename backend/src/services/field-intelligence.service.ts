import { Fields } from "../models/field.model";
import { FieldObservation } from "../models/field-observation.model";

import { getFieldNDVI } from "./satellite.service";
import {
  getFieldWeather,
  getFieldSoilMoisture,
} from "./weather.service";

import {
  saveAutomaticObservation,
} from "./field-observation.service";

export async function getFieldIntelligence(
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

  const latitude = field.centroid.latitude;
  const longitude = field.centroid.longitude;

  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(
    today.getDate() - 7
  );

  const fromDate = sevenDaysAgo
    .toISOString()
    .split("T")[0];

  const toDate = today
    .toISOString()
    .split("T")[0];

  /*
   * Fetch all external data simultaneously.
   */
  const [ndvi, weather, soil] =
    await Promise.all([
      getFieldNDVI(
        field.boundary.coordinates,
        fromDate,
        toDate
      ),

      getFieldWeather(
        latitude,
        longitude
      ),

      getFieldSoilMoisture(
        latitude,
        longitude
      ),
    ]);

  /*
   * Automatically save today's observation.
   *
   * The observation service prevents multiple
   * observations from being created for the same day.
   */
  await saveAutomaticObservation({
    fieldId,
    userId,

    ndvi: ndvi.ndvi,

    temperature:
      weather.current.temperature,

    humidity:
      weather.current.humidity,

    rainfall:
      weather.current.precipitation,

    moisture0To1cm:
      soil.moisture["0_1cm"],

    moisture1To3cm:
      soil.moisture["1_3cm"],

    moisture3To9cm:
      soil.moisture["3_9cm"],

    moisture9To27cm:
      soil.moisture["9_27cm"],
  });

  /*
   * Retrieve updated historical data
   * after saving today's observation.
   */
  const historical =
    await FieldObservation.find({
      fieldId,
      userId,
    })
      .sort({ observedAt: -1 })
      .limit(30)
      .lean();

  return {
    field: {
      id: field._id,
      name: field.name,
      areaHectares: field.areaHectares,

      centroid: {
        latitude,
        longitude,
      },
    },

    vegetation: {
      ndvi: ndvi.ndvi,
      date: ndvi.date,
    },

    weather: {
      current: weather.current,
      forecast: weather.forecast,
    },

    soil,

    history: historical,
  };
}