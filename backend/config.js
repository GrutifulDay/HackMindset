// import dotenv from "dotenv";
// dotenv.config();

// // ── SEC-TAJEMSTVÍ ─────────────────────────────────────────────
// export const INTERNAL_API_KEY = (process.env.INTERNAL_API_KEY || "")
//   .split(",")
//   .map(s => s.trim())
//   .filter(Boolean);

// export const SHARED_KEY = process.env.SHARED_KEY || "";
// export const ALLOW_LOCAL_NO_PROXY = process.env.ALLOW_LOCAL_NO_PROXY === "1";
// export const HACK_EXTENSION = process.env.HACK_EXTENSION || "HACK_EXTENSION";

// // JWT tokeny a klíče
// export const JWT_SECRET = process.env.JWT_SECRET || "";
// export const HACK_MINDSET = process.env.HACK_MINDSET || "";

// // API Keys
// export const FETCH_API_NASA = process.env.FETCH_API_NASA || "";
// export const API_KEY_NASA = process.env.API_KEY_NASA || "";
// export const TOKEN_IP_CITY = process.env.TOKEN_IP_CITY || "";
// export const MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY || "";

// // Databáze
// export const MONGO_URI = process.env.MONGO_URI || "";
// export const MONGO_URI_FRONTEND = process.env.MONGO_URI_FRONTEND || "";

// // Discord
// export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

// Chrome extension
// export const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID || "";
// export const CHROME_EXTENSION_ALL_URL = CHROME_EXTENSION_ID
//   ? `chrome-extension://${CHROME_EXTENSION_ID}`
//   : "";

// // ── CENTRÁLNÍ POLE SENSITIVE KEYS ─────────────────────────────
// export const SENSITIVE_KEYS = {
//   INTERNAL_API_KEY,
//   SHARED_KEY,
//   JWT_SECRET,
//   HACK_MINDSET,
//   API_KEY_NASA,
//   FETCH_API_NASA,
//   TOKEN_IP_CITY,
//   MAXMIND_LICENSE_KEY,
//   MONGO_URI,
//   MONGO_URI_FRONTEND,
//   DISCORD_WEBHOOK_URL,
// };




import dotenv from "dotenv";
dotenv.config();

// ── SEC-TAJEMSTVÍ ─────────────────────────────────────────────
export const INTERNAL_API_KEY = (process.env.INTERNAL_API_KEY || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

export const SHARED_KEY = process.env.SHARED_KEY || "";
export const ALLOW_LOCAL_NO_PROXY = process.env.ALLOW_LOCAL_NO_PROXY === "1";

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
export const NASA_FALLBACK = process.env.NASA_FALLBACK || "";
export const NASA_ARCHIVE = process.env.NASA_ARCHIVE || "";
export const NASA_BASE_URL = process.env.NASA_BASE_URL || "";


// Databáze
export const MONGO_URI = process.env.MONGO_URI || "";
export const MONGO_URI_FRONTEND = process.env.MONGO_URI_FRONTEND || "";

// IPinfo.io
export const TOKEN_IP_CITY = process.env.TOKEN_IP_CITY || "";

// JWT token 
export const JWT_SECRET = process.env.JWT_SECRET
export const HACK_MINDSET = process.env.HACK_MINDSET

// Discord
export const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "";

export const MAXMIND_LICENSE_KEY = process.env.MAXMIND_LICENSE_KEY || "";
