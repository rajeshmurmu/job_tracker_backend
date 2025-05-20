import express from "express";
import {
  deleteJob,
  createJob,
  getAllJobs,
  updateJob,
  getJob,
} from "../controllers/jobs.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// auth middleware
router.use(isAuthenticated);

router.route("/").get(getAllJobs);
router.route("/:id").get(getJob);
router.route("/").post(createJob);
router.route("/:id").put(updateJob);
router.route("/:id").delete(deleteJob);

export default router;
