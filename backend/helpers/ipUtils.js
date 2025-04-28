import { TOKEN_IP_CITY } from "../config.js";

export async function getCityByIP(ip) {
  const realIP =
  ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "127.0.0.1"
    ? "8.8.8.8" // náhrada localhostu za veřejnou IP
    : ip;

const token = TOKEN_IP_CITY

try {
  const response = await fetch(`https://ipinfo.io/${realIP}/json?token=${token}`);
  const data = await response.json();
  console.log("🔍 Data z ipinfo.io:", data);
  return data.city || "Neznámé město";
} catch (err) {
  console.error("❌ Chyba při získávání města:", err.message);
  return "Neznámé město";
  }
}
