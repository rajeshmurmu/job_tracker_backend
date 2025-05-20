import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// api routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import jobRoutes from "./routes/job.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/jobs", jobRoutes);

export default app;
