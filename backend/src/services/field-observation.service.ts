import { FieldObservation } from "../models/field-observation.model";

export async function createFieldObservation(
  data: {
    fieldId: string;
    userId: string;
    ndvi?: number | null;

    temperature?: number | null;
    humidity?: number | null;
    rainfall?: number | null;

    moisture0To1cm?: number | null;
    moisture1To3cm?: number | null;
    moisture3To9cm?: number | null;
    moisture9To27cm?: number | null;

    observedAt?: Date;
  }
) {
  return FieldObservation.create({
    fieldId: data.fieldId,
    userId: data.userId,

    observedAt: data.observedAt || new Date(),

    vegetation: {
      ndvi: data.ndvi ?? null,
    },

    weather: {
      temperature: data.temperature ?? null,
      humidity: data.humidity ?? null,
      rainfall: data.rainfall ?? null,
    },

    soil: {
      moisture0To1cm:
        data.moisture0To1cm ?? null,

      moisture1To3cm:
        data.moisture1To3cm ?? null,

      moisture3To9cm:
        data.moisture3To9cm ?? null,

      moisture9To27cm:
        data.moisture9To27cm ?? null,
    },
  });
}

export async function getFieldObservations(
  fieldId: string,
  userId: string,
  limit = 30
) {
  return FieldObservation.find({
    fieldId,
    userId,
  })
    .sort({ observedAt: -1 })
    .limit(limit)
    .lean();
}

// import { FieldObservation } from "../models/field-observation.model";

export async function saveAutomaticObservation(data: {
  fieldId: string;
  userId: string;

  ndvi?: number | null;

  temperature?: number | null;
  humidity?: number | null;
  rainfall?: number | null;

  moisture0To1cm?: number | null;
  moisture1To3cm?: number | null;
  moisture3To9cm?: number | null;
  moisture9To27cm?: number | null;
}) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  return FieldObservation.findOneAndUpdate(
    {
      fieldId: data.fieldId,
      userId: data.userId,
      observedAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    },
    {
      $set: {
        observedAt: new Date(),

        vegetation: {
          ndvi: data.ndvi ?? null,
        },

        weather: {
          temperature: data.temperature ?? null,
          humidity: data.humidity ?? null,
          rainfall: data.rainfall ?? null,
        },

        soil: {
          moisture0To1cm:
            data.moisture0To1cm ?? null,

          moisture1To3cm:
            data.moisture1To3cm ?? null,

          moisture3To9cm:
            data.moisture3To9cm ?? null,

          moisture9To27cm:
            data.moisture9To27cm ?? null,
        },
      },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );
}