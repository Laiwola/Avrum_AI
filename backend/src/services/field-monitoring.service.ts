import { Fields } from "../models/field.model";
import { getFieldNDVI, getFieldNDVIMap, } from "./satellite.service";

export async function getFieldVegetationData(
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

 const today = new Date();

const thirtyDaysAgo = new Date();

thirtyDaysAgo.setDate(
  today.getDate() - 30
);

const fromDate =
  thirtyDaysAgo
    .toISOString()
    .split("T")[0];

const toDate =
  today
    .toISOString()
    .split("T")[0];

  const result = await getFieldNDVI(
    field.boundary.coordinates,
    fromDate,
    toDate
  );

  return {
    field: {
      id: field._id,
      name: field.name,
      areaHectares: field.areaHectares,
    },

    vegetation: {
      ndvi: result.ndvi,
      date: result.date,
    },
  };
}

export async function getFieldVegetationMap(
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

  const today = new Date();

  const thirtyDaysAgo =
    new Date();

  thirtyDaysAgo.setDate(
    today.getDate() - 30
  );

  const fromDate =
    thirtyDaysAgo
      .toISOString()
      .split("T")[0];

  const toDate =
    today
      .toISOString()
      .split("T")[0];

  const [vegetation, map] = await Promise.all([
    getFieldNDVI(
      field.boundary.coordinates,
      fromDate,
      toDate
    ).catch(() => ({ ndvi: null, date: null })),
    getFieldNDVIMap(
      field.boundary.coordinates,
      fromDate,
      toDate
    ),
  ]);

  return {
    field: {
      id: field._id.toString(),
      name: field.name,
      areaHectares:
        field.areaHectares,
    },

    vegetation: {
      ndvi: vegetation.ndvi,
      date: vegetation.date,
    },

    map: {
      image:
        `data:image/png;base64,${map.imageBase64}`,

      bounds:
        map.bounds,
    },
  };
}