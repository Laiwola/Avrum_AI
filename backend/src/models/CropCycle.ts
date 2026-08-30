import mongoose, { Schema, Document } from "mongoose";

export interface ICropCycle extends Document {
  fieldId: Schema.Types.ObjectId;
  cropId: Schema.Types.ObjectId;
  plantingDate: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  growthStage: string;
  yieldTarget?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const cropCycleSchema = new Schema<ICropCycle>(
  {
    fieldId: {
      type: Schema.Types.ObjectId,
      ref: "Field",
      required: true,
      index: true,
    },
    cropId: {
      type: Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },
    plantingDate: {
      type: Date,
      required: true,
    },
    expectedHarvestDate: Date,
    actualHarvestDate: Date,
    growthStage: {
      type: String,
      default: "seedling",
    },
    yieldTarget: Number,
    deletedAt: Date,
  },
  { timestamps: true }
);

export const CropCycle = mongoose.model<ICropCycle>("CropCycle", cropCycleSchema);
