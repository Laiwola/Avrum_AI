import mongoose, { Schema, Document } from "mongoose";

export interface IField extends Document {
  name: string;
  farmId: Schema.Types.ObjectId;
  boundary: {
    type: "Polygon" | "MultiPolygon" | "Point";
    coordinates: number[][][] | number[][];
  };
  areaHectares?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const fieldSchema = new Schema<IField>(
  {
    name: {
      type: String,
      required: true,
    },
    farmId: {
      type: Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
      index: true,
    },
    boundary: {
      type: {
        type: String,
        enum: ["Polygon", "MultiPolygon", "Point"],
        required: true,
      },
      coordinates: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
    areaHectares: Number,
    deletedAt: Date,
  },
  { timestamps: true }
);

// Index for geospatial queries
fieldSchema.index({ "boundary": "2dsphere" });
fieldSchema.index({ farmId: 1, deletedAt: 1 });

export const Field = mongoose.model<IField>("Field", fieldSchema);
