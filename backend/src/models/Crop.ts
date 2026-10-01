import mongoose, { Schema, Document } from "mongoose";

export interface ICrop extends Document {
  name: string;
  scientificName?: string;
  growthStages?: string[];
  typicalCycleDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

const cropSchema = new Schema<ICrop>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    scientificName: String,
    growthStages: [String],
    typicalCycleDays: Number,
  },
  { timestamps: true }
);

export const Crop = mongoose.model<ICrop>("Crop", cropSchema);
