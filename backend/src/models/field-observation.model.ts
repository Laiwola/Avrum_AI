import mongoose, { Schema, Document } from "mongoose";

export interface IFieldObservation extends Document {
  fieldId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;

  observedAt: Date;

  vegetation: {
    ndvi: number | null;
  };

  weather: {
    temperature: number | null;
    humidity: number | null;
    rainfall: number | null;
  };

  soil: {
    moisture0To1cm: number | null;
    moisture1To3cm: number | null;
    moisture3To9cm: number | null;
    moisture9To27cm: number | null;
  };
}

const fieldObservationSchema =
  new Schema<IFieldObservation>(
    {
      fieldId: {
        type: Schema.Types.ObjectId,
        ref: "Field",
        required: true,
        index: true,
      },

      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      observedAt: {
        type: Date,
        required: true,
        index: true,
      },

      vegetation: {
        ndvi: {
          type: Number,
          default: null,
        },
      },

      weather: {
        temperature: {
          type: Number,
          default: null,
        },

        humidity: {
          type: Number,
          default: null,
        },

        rainfall: {
          type: Number,
          default: null,
        },
      },

      soil: {
        moisture0To1cm: {
          type: Number,
          default: null,
        },

        moisture1To3cm: {
          type: Number,
          default: null,
        },

        moisture3To9cm: {
          type: Number,
          default: null,
        },

        moisture9To27cm: {
          type: Number,
          default: null,
        },
      },
    },
    {
      timestamps: true,
    }
  );

fieldObservationSchema.index({
  fieldId: 1,
    userId: 1,
  observedAt: -1,
});

export const FieldObservation =
  mongoose.model<IFieldObservation>(
    "FieldObservation",
    fieldObservationSchema
  );