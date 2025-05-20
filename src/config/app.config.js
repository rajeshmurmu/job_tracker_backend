import "dotenv/config";

const config = {
  port: process.env.PORT || 3000,
  mongodb_uri: process.env.MONGODB_URI,
  db_name: process.env.DB_NAME,
  jwt_secret: process.env.JWT_SECRET,
};

const _conf = Object.freeze(config);

export default _conf;
