import jwt from "jsonwebtoken";
import _conf from "../config/app.config.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized Access",
      });
    }

    const decodedToken = jwt.verify(accessToken, _conf.jwt_secret);

    if (!decodedToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("Error while verifying token", error);
  }
};
