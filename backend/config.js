import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 3000;
export const FETCH_API_NASA = process.env.FETCH_API_NASA;
export const API_KEY_NASA = process.env.API_KEY_NASA;
