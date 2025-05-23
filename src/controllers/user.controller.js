import User from "../models/user.model.js";
import {
  deleteImageFromCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";

import bcrypt from "bcryptjs";

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = undefined;
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error while getting user", error);
    return res.status(500).json({
      success: false,
      message: "Error while getting user",
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, email, current_password, new_password } = req.body;
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // verify the password
    const isPasswordCorrect = await bcrypt.compare(
      current_password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // update the user

    // update password
    if (new_password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(new_password, salt);
    }

    // update name
    if (user.name !== name) {
      user.name = name;
    }

    // update email
    if (user.email !== email) {
      user.email = email;
    }

    await user.save();

    return res
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .status(200)
      .json({
        success: true,
        message: "User updated successfully",
        user: user,
      });
  } catch (error) {
    console.log("Error while updating user", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating user",
    });
  }
};

export const updateAvatar = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // delete image from cloudinary
    if (user.avatar) {
      if (user.avatar.includes("cloudinary")) {
        await deleteImageFromCloudinary(user.avatar);
      }
    }

    // upload image to cloudinary
    const avatar_url = await uploadImageToCloudinary(req?.file?.path);
    console.log(avatar_url);

    user.avatar = avatar_url;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.log("Error while updating user", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating user",
    });
  }
};
