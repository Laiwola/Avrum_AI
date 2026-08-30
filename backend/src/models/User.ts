import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  phoneVerified?: boolean;
  passwordHash: string;
  location?: string;
  language: string;
  timezone: string;
  theme: "light" | "dark";
  organisation?: string;
  role: "farmer" | "agronomist" | "cooperative_lead" | "developer" | "admin";
  userType?: string;
  organizationId?: Schema.Types.ObjectId;
  bio?: string;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  verificationCode?: string;
  verificationCodeExpiresAt?: Date;
  onboardingCompleted: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  // Methods
  comparePassword(password: string): Promise<boolean>;
  toJSON(): Omit<IUser, "passwordHash" | "verificationCode" | "verificationCodeExpiresAt">;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    phone: String,
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    location: String,
    language: {
      type: String,
      enum: ["en", "ha", "yo", "ig", "fr", "sw"],
      default: "en",
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    organisation: String,
    role: {
      type: String,
      enum: ["farmer", "agronomist", "cooperative_lead", "developer", "admin"],
      default: "farmer",
    },
    userType: String,
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    bio: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: Date,
    verificationCode: String,
    verificationCodeExpiresAt: Date,
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: Date,
    deletedAt: Date,
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();

  try {
    const saltRounds = 12;
    this.passwordHash = await bcryptjs.hash(this.passwordHash, saltRounds);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcryptjs.compare(password, this.passwordHash);
};

// Remove password hash from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.verificationCode;
  delete obj.verificationCodeExpiresAt;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model<IUser>("User", userSchema);
