import express from "express";
import {
  getAllApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/application.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// auth middleware
router.use(isAuthenticated);

router.route("/").get(getAllApplications);
router.route("/:id").get(getApplication);
router.route("/").post(createApplication);
router.route("/:id").put(updateApplication);
router.route("/:id").delete(deleteApplication);

export default router;
