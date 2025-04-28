import dotenv from "dotenv";
dotenv.config();

// PORT
export const PORT = process.env.PORT || 3000;

// Fetch API
export const FETCH_API_NASA = process.env.FETCH_API_NASA;
export const API_KEY_NASA = process.env.API_KEY_NASA;

// Databaze
export const MONGO_URI = process.env.MONGO_URI;
export const MONGO_URI_FRONTEND = process.env.MONGO_URI_FRONTEND;

// IPinfo.io
export const TOKEN_IP_CITY = process.env.TOKEN_IP_CITY