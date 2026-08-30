import mongoose, { Schema, Document } from "mongoose";

export interface IFarm extends Document {
  name: string;
  ownerId: Schema.Types.ObjectId;
  organizationId?: Schema.Types.ObjectId;
  location: {
    country: string;
    state: string;
    town: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  size: number;
  sizeUnit: "hectares" | "acres";
  ownershipType: "individual" | "cooperative" | "commercial" | "government" | "ngo";
  crops: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const farmSchema = new Schema<IFarm>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    location: {
      country: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      town: {
        type: String,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    size: {
      type: Number,
      required: true,
    },
    sizeUnit: {
      type: String,
      enum: ["hectares", "acres"],
      default: "hectares",
    },
    ownershipType: {
      type: String,
      enum: ["individual", "cooperative", "commercial", "government", "ngo"],
      default: "individual",
    },
    crops: [
      {
        type: String,
      },
    ],
    deletedAt: Date,
  },
  { timestamps: true }
);

// Index for efficient querying
farmSchema.index({ ownerId: 1, deletedAt: 1 });
farmSchema.index({ organizationId: 1, deletedAt: 1 });

export const Farm = mongoose.model<IFarm>("Farm", farmSchema);
