import mongoose, { Document, Schema } from "mongoose";

export interface IOrganizationMember extends Document {
  organizationId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  role: "owner" | "admin" | "member" | "viewer";
  status: "active" | "pending" | "invited";
  createdAt: Date;
  updatedAt: Date;
}

const organizationMemberSchema = new Schema<IOrganizationMember>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: "Organization", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: {
      type: String,
      enum: ["owner", "admin", "member", "viewer"],
      default: "member",
    },
    status: {
      type: String,
      enum: ["active", "pending", "invited"],
      default: "active",
    },
  },
  { timestamps: true }
);

organizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export const OrganizationMember = mongoose.model<IOrganizationMember>(
  "OrganizationMember",
  organizationMemberSchema
);
