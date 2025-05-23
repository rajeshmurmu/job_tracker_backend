import express from "express";
import {
  getUser,
  updateAvatar,
  updateUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.use(isAuthenticated);
router.route("/me").get(getUser);
router.route("/me").put(updateUser);
router.route("/me/avatar").put(upload.single("avatar"), updateAvatar);

export default router;
