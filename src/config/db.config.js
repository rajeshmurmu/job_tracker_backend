import mongoose from "mongoose";
import _conf from "./app.config.js";

export async function connectDB() {
  try {
    const connection = await mongoose.connect(
      `${_conf.mongodb_uri}/${_conf.db_name}`
    );
    console.log(`Database connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("Database connection failed!", error);
  }
}
