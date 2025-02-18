import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profileImage?: string;
  role: "developer" | "manager";
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    role: {
      type: String,
      enum: ["developer", "manager"],
      required: true,
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
