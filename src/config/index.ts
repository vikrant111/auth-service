import { config } from "dotenv";
import path from "path";
console.log("environment", `../../.env.${process.env.NODE_ENV}`)
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`) });

const { PORT, NODE_ENV, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, DB_PORT, REFRESH_TOKEN_SECRET, JWKS_URI} =
  process.env;

export const Config = {
  PORT,
  NODE_ENV,
  DB_HOST,
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  REFRESH_TOKEN_SECRET,
  JWKS_URI
};
