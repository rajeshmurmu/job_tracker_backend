import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { limiter } from "./config/rate-limit.config.js";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(helmet());
app.use(morgan("combined"));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4173",
      "http://localhost:5173",
      _conf.client_url,
    ],
    credentials: true,
  })
);

// api routes
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import _conf from "./config/app.config.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/applications", applicationRoutes);

// default route or api home route
app.get("/", (req, res) => {
  res.json({ message: "Hello From JobTracker API" });
});

// Handle unknown routes
app.use((req, res, next) => {
  console.log(req.path);
  res.status(404).send("Sorry, can't find that!");
});

// custom error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something broke!",
    error: err.message || "Internal Server Error",
  });
});

export default app;
