// utils/discordNotification.js
import { DISCORD_WEBHOOK_URL } from "../config.js";

// Buffer pro IP → { count, reason, lastNotified }
const notifyBuffer = new Map();
const notifyTimers = new Map();

export function maskToken(token = "") {
  const parts = token.split(" ");
  if (parts.length === 1) {
    const t = parts[0];
    if (t.length <= 8) return t.replace(/.(?=.{2})/g, "*");
    return `${t.slice(0,4)}...${t.slice(-4)}`; // ← třeba 4+4 znaky
  }
  const scheme = parts[0];  // Bearer
  const t = parts.slice(1).join(" "); // vlastní token
  const masked = t.length <= 8
    ? t.replace(/.(?=.{2})/g, "*")
    : `${t.slice(0,4)}...${t.slice(-4)}`;
  return `${scheme} ${masked}`;
}


  

// citlivé hlavičky maskujeme
const SENSITIVE = [
    "authorization",
    "cookie",
    "proxy-authorization",
    "x-api-key",
    "set-cookie",
    "postman-token",       // ← přidáno
    "x-forwarded-for",    // ← přidáno (pokud nechceš zobrazovat proxied IP)
    "x-real-ip"           // ← přidáno
  ];

  function shortValue(v = "") {
    const s = String(v);
    if (s.length <= 40) return s;
    return `${s.slice(0,20)}...${s.slice(-10)}`; // ukážeme prefix a suffix
  }

  function formatHeaders(headers = {}) {
    return Object.entries(headers)
      .filter(([k]) => !SENSITIVE.includes(k.toLowerCase()))
      .map(([k, v]) => {
        if (k.toLowerCase() === "origin" && typeof v === "string" && v.startsWith("chrome-extension://")) {
          // maskuj extension ID (vezmeme jen prvních 8 a poslední 3 znaky)
          const masked = v.length > 20
            ? `${v.slice(0, 20)}...${v.slice(-3)}`
            : v;
          return `→ ${k}: ${masked}`;
        }
        return `→ ${k}: ${v}`;
      })
      .slice(0, 10) // max 10 hlaviček
      .join("\n");
  }


  function detectSensitive(headers = {}) {
    const found = [];
    const h = Object.fromEntries(
      Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v])
    );
  
    if (h["authorization"]) {
      found.push(`Authorization: ${maskToken(h["authorization"])}`);
    }
    
  
    if (h["x-api-key"]) {
      const k = String(h["x-api-key"]);
      found.push(
        `X-API-Key: ${k.length > 8
          ? `${k.slice(0, 4)}...${k.slice(-4)}`
          : `${k.slice(0, 2)}...${k.slice(-2)}`
        }`
      );
    }
  
    if (h["postman-token"]) {
      const t = String(h["postman-token"]);
      found.push(`Postman-Token: ${maskToken(t)}`);
    }
  
    if (h["cookie"]) {
      found.push("Cookie: [REDACTED]");
    }
    if (h["proxy-authorization"]) {
      found.push(`Proxy-Authorization: ${maskToken(h["proxy-authorization"])}`);
    }
    
    if (h["x-forwarded-for"]) {
      found.push(`X-Forwarded-For: ${shortValue(h["x-forwarded-for"])}`);
    }

    if (h["authorization"]) {
      const masked = maskToken(h["authorization"]);
      console.log("DEBUG masked authorization →", masked);
      found.push(`Authorization: ${masked}`);
    }
    
  
    return found;
  }
  

  function maskIP(ip = "") {
    if (!ip) return "Neznámá IP";
  
    // IPv4
    if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) {
      const parts = ip.split(".");
      parts[3] = "*"; // poslední oktet zamaskujeme
      return parts.join(".");
    }
  
    // IPv6
    if (ip.includes(":")) {
      const parts = ip.split(":");
      return parts.slice(0, 2).join(":") + ":****:****";
    }
  
    return ip; // fallback
  }
  

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
  const key = `${ip}|${reason}`;
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

  if (notifyTimers.has(key)) return;

  // každých 5s shrnutí
  notifyTimers.set(
    key,
    setTimeout(async () => {
      const r = notifyBuffer.get(key);

      const sensitiveBlock = (r.originalHeaders || headers) ? detectSensitive(r.originalHeaders || headers) : [];
      const headersBlock = headers ? `\n📦 Headers:\n${formatHeaders(headers)}` : "";
      const sensitiveInfo =
            sensitiveBlock.length > 0
                 ? `\n🔑 Sensitive headers:\n- ${sensitiveBlock.join("\n- ")}`
                 : "";
      const requestsInfo = typeof requests === "number" ? `📊 Requests: ${requests}\n` : "";

      const message = {
        content:
          `🚫 **Blocked**\n` +
          `📄 Reason: *${reason}*\n` +
          `🌐 IP: ${maskIP(ip)}\n` +
          (r.method && r.path ? `🔗 Endpoint: ${r.method} ${r.path}\n` : "") +
          `💻 User-Agent: ${r.ua}\n` +
          `🌏 City: ${r.city}\n` +
          requestsInfo +
          `🕒 ${new Date().toLocaleString("cs-CZ")}` +
          sensitiveInfo +
          headersBlock,
      };

      try {
        await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(message),
        });
        console.log(`✅ Notifikace (${reason}) pro ${ip}: ${r.count}x`);
      } catch (e) {
        console.error("❌ Chyba při odesílání na Discord:", e.message);
      }

      notifyBuffer.delete(key);
      notifyTimers.delete(key);
    }, 5000)
  );
}
