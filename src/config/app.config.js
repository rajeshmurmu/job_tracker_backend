import "dotenv/config";

const config = {
  port: process.env.PORT || 3000,
  mongodb_uri: process.env.MONGODB_URI,
  db_name: process.env.DB_NAME,
  jwt_secret: process.env.JWT_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

const _conf = Object.freeze(config);

export default _conf;
