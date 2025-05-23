import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { loginSchema, registerSchema } from "../utils/vinejsDataValidation.js";
import vine, { errors } from "@vinejs/vine";
import jwt from "jsonwebtoken";
import _conf from "../config/app.config.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // validate user input

    const validator = vine.compile(registerSchema);
    const validatedData = await validator.validate({
      name,
      email,
      password,
      password_confirmation: confirmPassword,
    });

    // find if user already exists
    const userExists = await User.findOne({ email: validatedData.email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    validatedData.avatar = `https://avatar.iran.liara.run/username?username=${name.replace(
      " ",
      "+"
    )}`;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);
    validatedData.password = hashedPassword;

    // create new user
    const user = await User.create(validatedData);

    // TODO:: send verification email and activate account

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Error while registering user",
      });
    }

    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ success: false, error: error.messages });
    }

    console.log("Error while registering user", error);
    return res.status(500).json({
      success: false,
      message: "Error while registering user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // validate user input
    const { email, password } = req.body;

    const validator = vine.compile(loginSchema);
    const validatedData = await validator.validate({
      email,
      password,
    });

    // find the user by email
    const user = await User.findOne({ email: validatedData.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create token
    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      _conf.jwt_secret,
      {
        expiresIn: "1d",
      }
    );

    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // save refresh token with current user
    user.refreshAccessToken = refreshToken;
    await user.save();
    user.password = undefined;

    // send response
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    return res
      .cookie("refreshToken", refreshToken, cookieOptions)
      .cookie("accessToken", accessToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        refreshToken,
        accessToken,
        user,
      });
  } catch (error) {
    // Handle validation errors
    if (error instanceof errors.E_VALIDATION_ERROR) {
      return res.status(400).json({ success: false, error: error.messages });
    }

    console.log("Error while logging user", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging user",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const user = await User.findOne({ refreshAccessToken: refreshToken });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      _conf.jwt_secret,
      {
        expiresIn: "1d",
      }
    );

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    return res
      .cookie("accessToken", accessToken, cookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Access token refreshed successfully",
      });
  } catch (error) {
    console.log("Error while refreshing access token", error);
    return res.status(500).json({
      success: false,
      message: "Error while refreshing access token",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const user = await User.findOne({ refreshAccessToken: refreshToken });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    user.refreshAccessToken = null;
    await user.save();
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error while logging out user", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out user",
    });
  }
};
