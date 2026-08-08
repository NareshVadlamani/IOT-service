import dotenv from "dotenv";

dotenv.config();

const ENV = process.env;

export default {
  port: ENV.PORT,
  jwtSecret: ENV.JWT_SECRET,
};
