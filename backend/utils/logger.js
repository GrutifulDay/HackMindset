// utils/logger.js
import { DEBUG, NODE_ENV } from "../config.js";

// Bezpečné maskování citlivostí
export function mask(val, keep = 3) {
  if (!val || typeof val !== "string") return "";
  if (val.length <= keep * 2) return "*".repeat(val.length);
  return val.slice(0, keep) + "…" + val.slice(-keep);
}

// Debug log – zapne se, když DEBUG=1 nebo NODE_ENV=development
export function debug(...args) {
  if (DEBUG || NODE_ENV === "development") {
    console.log(...args);
  }
}

// Info/Warn/Error – vždy viditelné (ale krátké a bezpečné)
export const info  = (...args) => console.log(...args);
export const warn  = (...args) => console.warn(...args);
export const error = (...args) => console.error(...args);
