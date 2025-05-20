import app from "./src/app.js";
import _conf from "./src/config/app.config.js";
import { connectDB } from "./src/config/db.config.js";

const PORT = _conf.port;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Database connection failed!", error);
  });
