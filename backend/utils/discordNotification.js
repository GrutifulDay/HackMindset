import { DISCORD_WEBHOOK_URL } from "../config.js";
import { debug, error } from "../utils/logger.js";
import { hashIp } from "./hashIp.js";


// 🧠 Tyto dvě mapy slouží jako "paměť" mezi jednotlivými voláními funkce.
// notifyBuffer ukládá informace o tom, kolikrát byla IP blokována (aby se notifikace neposílaly zbytečně často).
// notifyTimers zajišťuje, že se zpráva pošle až po určitém intervalu (zde 5 sekund).
const notifyBuffer = new Map();
const notifyTimers = new Map();


// 🛡️ Funkce, která zamaskuje citlivý token (např. Bearer token nebo API klíč).
// Používá se v hlavičkách i v dekódování JWT, aby se celé hodnoty nedostaly do logu nebo Discordu.
export function maskToken(token = "") {
  const parts = token.split(" ");

  // pokud není schéma ("Bearer"), maskujeme celý token
  if (parts.length === 1) {
    const t = parts[0];
    if (t.length <= 8) return t.replace(/.(?=.{2})/g, "*");
    return `${t.slice(0,4)}...${t.slice(-4)}`; // např. "abcd...wxyz"
  }

  // jinak maskujeme jen samotnou hodnotu tokenu, ale zachováme "Bearer "
  const scheme = parts[0];
  const t = parts.slice(1).join(" ");
  const masked = t.length <= 8
    ? t.replace(/.(?=.{2})/g, "*")
    : `${t.slice(0,4)}...${t.slice(-4)}`;
  return `${scheme} ${masked}`;
}


// 🧩 Seznam citlivých hlaviček, které nechceme logovat nebo posílat na Discord v plné podobě.
const SENSITIVE = [
  "authorization",
  "cookie",
  "proxy-authorization",
  "x-api-key",
  "set-cookie",
  "postman-token",
  "x-forwarded-for",
  "x-real-ip"
];

// 🧩 Pomocná funkce – pokud je hodnota dlouhá, zobrazí jen část prefixu a suffixu.
function shortValue(v = "") {
  const s = String(v);
  if (s.length <= 40) return s;
  return `${s.slice(0,20)}...${s.slice(-10)}`;
}


// 📦 Vytvoří textový seznam hlaviček pro Discord zprávu.
// Vynechá citlivé položky a u "Origin" zamaskuje ID Chrome rozšíření.
function formatHeaders(headers = {}) {
  return Object.entries(headers)
    .filter(([k]) => !SENSITIVE.includes(k.toLowerCase()))
    .map(([k, v]) => {
      if (k.toLowerCase() === "origin" && typeof v === "string" && v.startsWith("chrome-extension://")) {
        // Maskujeme extension ID, aby nebylo veřejné
        const masked = v.length > 20
          ? `${v.slice(0, 20)}...${v.slice(-3)}`
          : v;
        return `→ ${k}: ${masked}`;
      }
      return `→ ${k}: ${v}`;
    })
    .slice(0, 10) // omezíme počet zobrazených hlaviček (max. 10)
    .join("\n");
}


// 🕵️‍♀️ Detekuje a maskuje citlivé hlavičky (Authorization, Cookies, API klíče...).
// Výsledkem je seznam textových řádků vhodný pro přehledné zobrazení v notifikaci.
function detectSensitive(headers = {}) {
  const found = [];
  const h = Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
  );

  if (h["authorization"]) found.push(`Authorization: ${maskToken(h["authorization"])}`);
  if (h["x-api-key"]) {
    const k = String(h["x-api-key"]);
    found.push(`X-API-Key: ${k.length > 8 ? `${k.slice(0, 4)}...${k.slice(-4)}` : `${k.slice(0, 2)}...${k.slice(-2)}`}`);
  }
  if (h["postman-token"]) found.push(`Postman-Token: ${maskToken(h["postman-token"])}`);
  if (h["cookie"]) found.push("Cookie: [REDACTED]");
  if (h["proxy-authorization"]) found.push(`Proxy-Authorization: ${maskToken(h["proxy-authorization"])}`);
  if (h["x-forwarded-for"]) found.push(`X-Forwarded-For: ${shortValue(h["x-forwarded-for"])}`);

  return found;
}


// 🌍 Zamaskuje IP adresu (IPv4 i IPv6) – z bezpečnostních důvodů neukazuje celé.
// function maskIP(ip = "") {
//   if (!ip) return "Neznámá IP";
//   if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) { // IPv4
//     const parts = ip.split(".");
//     parts[3] = "*";
//     return parts.join(".");
//   }
//   if (ip.includes(":")) { // IPv6
//     const parts = ip.split(":");
//     return parts.slice(0, 2).join(":") + ":****:****";
//   }
//   return ip;
// }


// 🚨 Hlavní export – odešle Discord notifikaci o zablokované IP, revokovaném tokenu apod.
export async function notifyBlockedIP({
  ip,
  city,
  userAgent,
  reason,
  method,
  path,
  headers,
  requests,
}) {
  // unikátní klíč pro slučování notifikací (IP + důvod)
  const key = `${ip}|${reason}`;

  // získáme nebo vytvoříme záznam o dané IP
  const record = notifyBuffer.get(key) || {
    count: 0,
    method,
    path,
    ua: userAgent,
    city,
    originalHeaders: headers,
  };
  record.count++;
  notifyBuffer.set(key, record);

  // zabráníme opakovanému odesílání v krátkém čase
  if (notifyTimers.has(key)) return;

  // ⏱️ Naplánujeme odeslání notifikace za 5 sekund (debounce mechanismus)
  notifyTimers.set(
    key,
    setTimeout(async () => {
      const r = notifyBuffer.get(key);

      // zjištění citlivých hlaviček
      const sensitiveBlock = (r.originalHeaders || headers)
        ? detectSensitive(r.originalHeaders || headers)
        : [];

      // zformátování běžných hlaviček
      const headersBlock = headers ? `\n📦 Headers:\n${formatHeaders(headers)}` : "";

      // vytvoření přehledu citlivých hodnot
      const sensitiveInfo = sensitiveBlock.length > 0
        ? `\n🔑 Sensitive headers:\n- ${sensitiveBlock.join("\n- ")}`
        : "";

      const requestsInfo = typeof requests === "number" ? `📊 Requests: ${requests}\n` : "";

      const hashedIp = hashIp(ip);
      
      // 🧩 základní text notifikace
      let content =
        `🚫 **Blocked**\n` +
        `📄 Reason: *${reason}*\n` +
        `🌐 IP (hashed): ${hashedIp}\n` +
        (r.method && r.path ? `🔗 Endpoint: ${r.method} ${r.path}\n` : "") +
        `💻 User-Agent: ${r.ua}\n` +
        `🌏 City: ${r.city}\n` +
        requestsInfo +
        `🕒 ${new Date().toLocaleString("cs-CZ")}` +
        sensitiveInfo +
        headersBlock;

      // 🧠 JWT dekódování (s maskováním hodnot)
      const auth = headers?.authorization || headers?.Authorization;
      if (auth && auth.startsWith("Bearer ")) {
        const tokenPart = auth.split(" ")[1];
        const tokenParts = tokenPart.split(".");
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(Buffer.from(tokenParts[1], "base64").toString("utf8"));

            // pomocné funkce pro maskování
            const maskId = (id = "") =>
              id.length <= 8 ? id.replace(/.(?=.{2})/g, "*") : `${id.slice(0, 4)}...${id.slice(-4)}`;

            const maskExtId = (ext = "") => {
              if (!ext) return "missing";
              const idx = ext.indexOf("://");
              if (idx !== -1) {
                const prefix = ext.slice(0, idx + 3);
                const rest = ext.slice(idx + 3);
                return rest.length <= 8
                  ? `${prefix}${rest.replace(/.(?=.{2})/g, "*")}`
                  : `${prefix}${rest.slice(0, 6)}...${rest.slice(-4)}`;
              }
              return maskId(ext);
            };

            const audHost = (aud = "") => {
              try { return new URL(aud).host; }
              catch { return aud.length > 30 ? aud.slice(0, 30) + "..." : aud; }
            };

            // přidání dekódovaného, ale maskovaného JWT payloadu do zprávy
            content += `\n\n🔍 **Decoded JWT payload (masked):**`;
            if (payload.jti) content += `\n• JTI: ${maskId(payload.jti)}`;
            if (payload.sub) content += `\n• Sub: ${payload.sub}`;
            if (payload.aud) content += `\n• Aud host: ${audHost(payload.aud)}`;
            if (payload.extId) content += `\n• ExtID: ${maskExtId(payload.extId)}`;
            if (payload.iat)
              content += `\n• IAT: ${new Date(payload.iat * 1000).toLocaleString("cs-CZ")}`;
            if (payload.exp)
              content += `\n• EXP: ${new Date(payload.exp * 1000).toLocaleString("cs-CZ")}`;
          } catch {
            content += `\n\n🔍 JWT payload: [invalid or not decodable]`;
          }
        }
      }

      // odeslání notifikace do Discord webhooku
      const message = { content };

      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        });
        debug(`✅ Notifikace (${reason}) pro ${ip}: ${r.count}x`);
      } catch (e) {
        error("❌ Chyba při odesílání na Discord:", e.message);
      }

      // po odeslání vymažeme buffer i timer
      notifyBuffer.delete(key);
      notifyTimers.delete(key);
    }, 5000)
  );
}

