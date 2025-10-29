import { DEV_MODE } from "../config.js";

const NODE_ENV = location.hostname.includes("localhost")
  ? "development"
  : "production";

const styles = {
  debug: "color:#B980FF; font-weight:bold;",
  info: "color:#00AEEF; font-weight:bold;",
  warn: "color:#E7B416; font-weight:bold;",
  error: "color:#FF4F4F; font-weight:bold;",
  valueTrue: "color:#FFD700",
  valueFalse: "color:#FF6666",
  valueNull: "color:#999",
};

function colorizeValue(val) {
  if (val === true) return ["%ctrue", styles.valueTrue];
  if (val === false) return ["%cfalse", styles.valueFalse];
  if (val === null) return ["%cnull", styles.valueNull];
  return [val, ""];
}

function formatArgs(args) {
  const formatted = [];
  args.forEach((arg) => {
    if (typeof arg === "object") {
      try {
        formatted.push(JSON.stringify(arg, null, 2));
      } catch {
        formatted.push(String(arg));
      }
    } else {
      const [val, style] = colorizeValue(arg);
      formatted.push(val, style);
    }
  });
  return formatted;
}

export function debug(...args) {
  if (DEV_MODE === true) {
    console.log(`%c[DEBUG]`, styles.debug, ...formatArgs(args));
  }
}

export function info(...args) {
  if (DEV_MODE === true || NODE_ENV !== "production") {
    console.log(`%c[INFO]`, styles.info, ...formatArgs(args));
  }
}

export function warn(...args) {
  console.warn(`%c[WARN]`, styles.warn, ...formatArgs(args));
}

export function error(...args) {
  console.error(`%c[ERROR]`, styles.error, ...formatArgs(args));
}
