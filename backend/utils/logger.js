// utils/logger.js
import chalk from "chalk";
import { DEBUG, NODE_ENV } from "../config.js";

// Maskování tajných údajů
export function mask(val, keep = 3) {
  if (!val || typeof val !== "string") return "";
  if (val.length <= keep * 2) return "*".repeat(val.length);
  return val.slice(0, keep) + "…" + val.slice(-keep);
}

// 🧠 Debug – zobrazí se jen pokud DEBUG=true nebo NODE_ENV=development
export function debug(...args) {
  if (DEBUG || NODE_ENV === "development") {
    console.log(chalk.magenta.bold("[DEBUG]"), ...args);
  }
}

// ℹ️ Info – vždy viditelné
export const info = (...args) => {
  console.log(chalk.blue.bold("[INFO]"), ...args);
};

// ⚠️ Warning – vždy viditelné
export const warn = (...args) => {
  console.warn(chalk.yellow.bold("[WARN]"), ...args);
};

// 💥 Error – vždy viditelné
export const error = (...args) => {
  console.error(chalk.red.bold("[ERROR]"), ...args);
};
