import mongoose, { Document, Schema } from "mongoose";

export interface ISession extends Document {
  userId: Schema.Types.ObjectId;
  accessTokenJti: string;
  refreshTokenJti: string;
  refreshTokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  deviceName?: string;
  expiresAt: Date;
  revokedAt?: Date;
  revokedReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    accessTokenJti: { type: String, required: true, index: true },
    refreshTokenJti: { type: String, required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    userAgent: String,
    ipAddress: String,
    deviceName: String,
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    revokedReason: String,
  },
  { timestamps: true }
);

sessionSchema.index({ userId: 1, revokedAt: 1 });

export const Session = mongoose.model<ISession>("Session", sessionSchema);
