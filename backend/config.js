import dotenv from "dotenv";
dotenv.config();

// ── SEC-TAJEMSTVÍ ─────────────────────────────────────────────
export const INTERNAL_API_KEYS = (process.env.INTERNAL_API_KEY || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

export const SHARED_KEY = process.env.SHARED_KEY || "";
export const ALLOW_LOCAL_NO_PROXY = process.env.ALLOW_LOCAL_NO_PROXY === "1";
export const HACK_EXTENSION = process.env.HACK_EXTENSION || "HACK_EXTENSION";

// ── OSTATNÍ ───────────────────────────────────────────────────
export const DEBUG = process.env.DEBUG === "1";
export const NODE_ENV = process.env.NODE_ENV || "development";

export const PORT = process.env.PORT || 3000;

// ID Chrome (all URL jen pokud je ID dostupné)
export const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID || "";
export const CHROME_EXTENSION_ALL_URL = CHROME_EXTENSION_ID
  ? `chrome-extension://${CHROME_EXTENSION_ID}`
  : "";

// Fetch API
export const FETCH_API_NASA = process.env.FETCH_API_NASA || "";
export const API_KEY_NASA = process.env.API_KEY_NASA || "";

// Databáze
export const MONGO_URI = process.env.MONGO_URI || "";
export const MONGO_URI_FRONTEND = process.env.MONGO_URI_FRONTEND || "";

// IPinfo.io
export const TOKEN_IP_CITY = process.env.TOKEN_IP_CITY || "";

// Api key frontend (pokud je používáš)
export const NASA_API_FRONTEND = process.env.NASA_API_FRONTEND || "";
export const STORY_API_FRONTEND = process.env.STORY_API_FRONTEND || "";
export const RETRO_API_FRONTEND = process.env.RETRO_API_FRONTEND || "";
export const PROFILE_API_FRONTEND = process.env.PROFILE_API_FRONTEND || "";

// Discord
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

export const MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY || "";
