import dotenv from "dotenv";
dotenv.config();

// ── ZÁKLADNÍ NASTAVENÍ
export const NODE_ENV = process.env.NODE_ENV || "development";
export const DEBUG = process.env.DEBUG === "true";

export const config = {
  env: NODE_ENV,
  debug: DEBUG,
};

// PORT
export const PORT = process.env.PORT || 3000;

// ------------ URL VYVOJ / PRODUKCE -------------
export const API_BASE_URL = process.env.API_BASE_URL || "https://localhost:3000/api";

// ID Chrome (all URL jen pokud je ID dostupné)
export const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID || "";
export const CHROME_EXTENSION_ALL_URL = CHROME_EXTENSION_ID
  ? `chrome-extension://${CHROME_EXTENSION_ID}`
  : "";

// Fetch API
export const FETCH_API_NASA = process.env.FETCH_API_NASA || "";
export const API_KEY_NASA = process.env.API_KEY_NASA || "";
export const NASA_FALLBACK = process.env.NASA_FALLBACK || "";
export const NASA_ARCHIVE = process.env.NASA_ARCHIVE || "";
export const NASA_BASE_URL = process.env.NASA_BASE_URL || "";

// Databáze
export const MONGO_URI = process.env.MONGO_URI || "";
export const MONGO_URI_FRONTEND = process.env.MONGO_URI_FRONTEND || "";

// IPinfo.io
export const TOKEN_IP_CITY = process.env.TOKEN_IP_CITY || "";

export const SHARED_KEY = process.env.SHARED_KEY || "";



// JWT token 
export const JWT_SECRET = process.env.JWT_SECRET
export const EXTENSION_SIGNATURE = process.env.EXTENSION_SIGNATURE

// Discord
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

// Hash
export const HASH_KEY = process.env.HASH_KEY

// Seznam hlidanych hesel
export const SENSITIVE_KEYS = (process.env.SENSITIVE_KEYS || "")
  .split(",")
  .map(k => k.trim())
  .filter(Boolean);

