import mongoose, { Document, Schema } from "mongoose";

export interface IOnboardingDraft extends Document {
  userId: Schema.Types.ObjectId;
  step?: number;
  status: "in_progress" | "completed";
  data: Record<string, unknown>;
  lastSavedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const onboardingDraftSchema = new Schema<IOnboardingDraft>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    step: Number,
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress",
    },
    data: { type: Schema.Types.Mixed, default: {} },
    lastSavedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

onboardingDraftSchema.index({ userId: 1 }, { unique: true });

export const OnboardingDraft = mongoose.model<IOnboardingDraft>("OnboardingDraft", onboardingDraftSchema);
