import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import Parse from "parse/node";

console.log("ENV:", {
  APP_ID: process.env.VITE_PARSE_APP_ID,
  JS_KEY: process.env.VITE_PARSE_JS_KEY,
  SERVER_URL: process.env.VITE_PARSE_SERVER_URL,
  MASTER_KEY: process.env.PARSE_MASTER_KEY,
});

Parse.initialize(process.env.VITE_PARSE_APP_ID!, process.env.VITE_PARSE_JS_KEY!);

Parse.masterKey = process.env.PARSE_MASTER_KEY!;
Parse.serverURL = process.env.VITE_PARSE_SERVER_URL!;

export default Parse;
