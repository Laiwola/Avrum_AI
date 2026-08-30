import mongoose, { Document, Schema } from "mongoose";

export interface IOrganization extends Document {
  name: string;
  slug: string;
  type: "individual" | "cooperative" | "ngo" | "enterprise" | "developer";
  ownerId: Schema.Types.ObjectId;
  settings?: Record<string, unknown>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ["individual", "cooperative", "ngo", "enterprise", "developer"],
      default: "individual",
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    settings: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Organization = mongoose.model<IOrganization>("Organization", organizationSchema);
