import { UAParser } from "ua-parser-js"
import { addToBlacklist } from "./ipBlacklist.js"

// ✅ IP normalizace (odstraní ::ffff:)
function normalizeIp(ip) {
  if (!ip) return ip
  const m = String(ip).match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)
  return m ? m[1] : ip
}

// ✅ Vytáhni IP – preferuj proxy hlavičku, jinak socket
function getUserIP(req) {
  const xff = req.headers["x-forwarded-for"]
  const ip =
    (Array.isArray(xff) ? xff[0] : (xff?.split(",")[0]?.trim())) ||
    req.socket?.remoteAddress ||
    req.connection?.remoteAddress ||
    req.ip ||
    "neznámá IP"
  return normalizeIp(ip)
}

export default async function botProtection(req, res, next) {
  const userAgentString = req.get("User-Agent") || ""
  const userIP = getUserIP(req)

  // --- (volitelná) výjimka pro Postman při testech ---
  // if (userAgentString.includes("Postman")) return next()

  // ⛔️ 1) Chybí User-Agent -> rovnou blok
  if (!userAgentString.trim()) {
    try {
      await addToBlacklist(userIP, "missingUserAgent", {
        userAgent: "Neznámý",
        endpoint: req.originalUrl,
        method: req.method,
        layer: "express",
        statusCode: 403,
      })
    } catch { /* nechceme kvůli logu shodit req */ }
    return res.status(403).json({ error: "❌ Přístup zamítnut." })
  }

  // 🔍 2) Analýza UA
  const parser = new UAParser(userAgentString)
  const result = parser.getResult()

  const browserName = result.browser?.name || "Neznámý"
  const deviceType  = result.device?.type  || "Neznámý"
  const osName      = result.os?.name     || "Neznámý"

  // ⚠️ 3) Podezřelé UA – browser „Other“ (typické pro curl/wget/skripty)
  //     Můžeš přidat vlastní signatury botů níže (curl, wget, python-requests, httpclient, go-http, libwww-perl…)
  const suspiciousSignatures = [
    "curl", "wget", "python-requests", "httpclient", "go-http", "libwww-perl",
    "okhttp", "java/", "node-fetch", "aiohttp", "scrapy",
  ]
  const looksLikeScript = suspiciousSignatures.some(sig =>
    userAgentString.toLowerCase().includes(sig)
  )

  if (browserName === "Other" || looksLikeScript) {
    try {
      await addToBlacklist(userIP, "suspiciousUserAgent", {
        userAgent: userAgentString,
        browser: browserName,
        os: osName,
        deviceType,
        endpoint: req.originalUrl,
        method: req.method,
        layer: "express",
        statusCode: 403,
      })
    } catch { /* ignore */ }
    return res.status(403).json({ error: "❌ Přístup zamítnut." })
  }

  // ✅ 4) Vypadá to jako běžný prohlížeč → pusť dál
  return next()
}
