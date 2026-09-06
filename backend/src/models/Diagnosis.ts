import { Schema, model, Document } from "mongoose";

export interface IDiagnosis extends Document {
  userId?: Schema.Types.ObjectId;

  crop: string;
  imageUrl: string;
  imageKey?: string;

  healthStatus: "healthy" | "diseased" | "unknown";

  disease: {
    name: string | null;
    confidence: number;
  };

  observations: string[];

  agronomistAdvice: {
    overview: string;
    symptoms: string[];
    causes: string[];
    treatment: string[];
    prevention: string[];
    severity: string;
    recommendedAction: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const diagnosisSchema = new Schema<IDiagnosis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    crop: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    imageKey: {
      type: String,
      required: false,
    },

    healthStatus: {
      type: String,
      enum: ["healthy", "diseased", "unknown"],
      required: true,
    },

    disease: {
      name: {
        type: String,
        default: null,
      },

      confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
      },
    },

    observations: {
      type: [String],
      default: [],
    },

    agronomistAdvice: {
      overview: {
        type: String,
        required: true,
      },

      symptoms: {
        type: [String],
        default: [],
      },

      causes: {
        type: [String],
        default: [],
      },

      treatment: {
        type: [String],
        default: [],
      },

      prevention: {
        type: [String],
        default: [],
      },

      severity: {
        type: String,
        required: true,
      },

      recommendedAction: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Diagnosis = model<IDiagnosis>(
  "Diagnosis",
  diagnosisSchema
);