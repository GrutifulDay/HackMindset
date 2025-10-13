import { isBlacklisted } from "./ipBlacklist.js"
import { HACK_MINDSET } from "../config.js"
import chalk from "chalk"

export function validateToken() {
  return async function (req, res, next) {
    const userIP =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "neznámá IP"

    const rawAuthHeader = req.headers.authorization || ""
    const authValue = rawAuthHeader.startsWith("Bearer ")
      ? rawAuthHeader.split(" ")[1]
      : ""

    // 🔁 Pokud přišel alias "HACK_MINDSET", přelož ho na tajné heslo z env
    const resolvedKey =
      authValue === "HACK_MINDSET" ? HACK_MINDSET : authValue

    // Ověření proti očekávanému klíči (z .env)
    const isValid = resolvedKey === HACK_MINDSET

    if (await isBlacklisted(userIP)) {
      return res.status(403).json({ error: "IP je na blacklistu." })
    }

    if (isValid) {
      console.log("✅ Přístup povolen")
      console.log(chalk.red.bold("→ resolvedKey:", resolvedKey))
      console.log(chalk.red.bold("→ expectedKey:", HACK_MINDSET))
      return next()
    }

    console.warn("🚫 Zamítnuto – neplatný klíč")
    console.log("→ authValue:", authValue)
    console.log("→ expectedKey:", HACK_MINDSET)
    return res.status(403).json({ error: "Access denied" })
  }
}


