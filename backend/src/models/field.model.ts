import mongoose, { Document, Schema } from "mongoose";

export interface IField extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;

  boundary: {
    type: "Polygon";
    coordinates: number[][][];
  };

  areaHectares: number;

  centroid: {
    latitude: number;
    longitude: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const fieldSchema = new Schema<IField>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    boundary: {
      type: {
        type: String,
        enum: ["Polygon"],
        required: true,
      },

      coordinates: {
        type: [[[Number]]],
        required: true,
      },
    },

    areaHectares: {
      type: Number,
      required: true,
      min: 0,
    },

    centroid: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

fieldSchema.index({ boundary: "2dsphere" });

export const Fields = mongoose.model<IField>("Fields", fieldSchema);