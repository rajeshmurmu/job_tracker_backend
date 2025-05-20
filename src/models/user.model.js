import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const roles = ["user", "admin"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    role: {
      type: String,
      enum: roles,
      default: "user",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    refreshAccessToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
