import User from "../models/user.model.js";

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
