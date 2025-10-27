// utils/logger.js
import chalk from "chalk";
import { DEBUG, NODE_ENV } from "../config.js";

// Maskování tajných údajů
// export function mask(val, keep = 3) {
//   if (!val || typeof val !== "string") return "";
//   if (val.length <= keep * 2) return "*".repeat(val.length);
//   return val.slice(0, keep) + "…" + val.slice(-keep);
// }

// 🎨 Barvy pro JSON hodnoty
function colorizeValue(val) {
  if (val === true) return chalk.yellow("true");
  if (val === false) return chalk.red("false");
  if (val === null) return chalk.gray("null");
  return val;
}

// 🧩 Helper pro hezký výpis objektů
function formatArgs(args) {
  return args.map((arg) => {
    if (typeof arg === "object") {
      return util.inspect(arg, {
        colors: true,
        depth: null,
        maxArrayLength: 10,
      });
    }
    return colorizeValue(arg);
  });
}

// 🧠 Debug – jen pokud DEBUG=true nebo NODE_ENV=development
export function debug(...args) {
  if (DEBUG || NODE_ENV === "development") {
    console.log(
      chalk.hex("#B980FF").bold("[DEBUG]"),
      chalk.magenta.bold(...formatArgs(args))
    );
  }
}

// ℹ️ Info – vždy viditelné
export const info = (...args) =>
  console.log(chalk.blueBright.bold("[INFO]"), chalk.white(...formatArgs(args)));

// ⚠️ Warning – vždy viditelné
export const warn = (...args) =>
  console.warn(chalk.yellow.bold("[WARN]"), chalk.yellowBright(...formatArgs(args)));

// 💥 Error – vždy viditelné
export const error = (...args) =>
  console.error(chalk.red.bold("[ERROR]"), chalk.redBright(...formatArgs(args)));