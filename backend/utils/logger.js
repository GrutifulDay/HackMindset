const debugMode = process.env.DEBUG === "1";

export function debug(...args) {
  if (debugMode) {
    console.log(...args);
  }
}