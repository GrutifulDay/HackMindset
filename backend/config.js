import dotenv from "dotenv"
dotenv.config()

// PORT
export const PORT = process.env.PORT || 3000
 
// ID Chrome 
export const CHROME_EXTENSION_ID = process.env.EXTENSION_ID
export const CHROME_EXTENSION_ALL_URL = `chrome-extension://${CHROME_EXTENSION_ID}`


// Fetch API
export const FETCH_API_NASA = process.env.FETCH_API_NASA
export const API_KEY_NASA = process.env.API_KEY_NASA

//Databaze
export const MONGO_URI = process.env.MONGO_URI
export const MONGO_URI_FRONTEND = process.env.MONGO_URI_FRONTEND

// IPinfo.io
export const TOKEN_IP_CITY = process.env.TOKEN_IP_CITY

// Api key frontend
export const NASA_API_FRONTEND = process.env.NASA_API_FRONTEND
export const STORY_API_FRONTEND = process.env.STORY_API_FRONTEND
export const RETRO_API_FRONTEND = process.env.RETRO_API_FRONTEND
export const PROFILE_API_FRONTEND = process.env.PROFILE_API_FRONTEND

// Discord 
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL