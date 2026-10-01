import mongoose, { Document, Schema } from "mongoose";

export interface IVerificationToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  type: "email_verification" | "password_reset";
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, index: true },
    type: { type: String, enum: ["email_verification", "password_reset"], required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const VerificationToken = mongoose.model<IVerificationToken>(
  "VerificationToken",
  verificationTokenSchema
);
