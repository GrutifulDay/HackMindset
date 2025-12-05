// middlewares/tokenUsage.js
import { revokeToken } from "./tokenRevocation.js";
import { notifyBlockedIP } from "../utils/discordNotification.js";
import { debug, warn } from "../utils/logger.js";


// In-memory store: jti -> usage info
const usage = new Map();

// konfigurace 
const WINDOW_MS = 2 * 60 * 1000; // 2 minuty
const MAX_IPS = 10;                // víc než 2 IP = podezrele
const MAX_UAS = 5;                // víc než 1 UA = podezrele
// pocet requestu ve WINDOW_MS - casove okno ve kterem sleduje chovani tokenu (da se snizit)
const MAX_REQUESTS = 500;   

export function registerTokenUsage({ jti, ip, userAgent, path }) {
  if (!jti) return;

  const now = Date.now();
  let info = usage.get(jti);

  if (!info) {
    info = {
      firstSeen: now,
      lastSeen: now,
      ips: new Set(),
      uas: new Set(),
      count: 0,
    };
    usage.set(jti, info);
  }

  // reset pokud okno proslo
  if (now - info.lastSeen > WINDOW_MS) {
    info.firstSeen = now;
    info.ips = new Set();
    info.uas = new Set();
    info.count = 0;
  }

  info.lastSeen = now;
  if (ip) info.ips.add(ip);
  if (userAgent) info.uas.add(userAgent);
  info.count += 1;

  debug(`tokenUsage: jti=${jti} ips=${[...info.ips].join(",")} uas=${[...info.uas].slice(0,3).join("|")} count=${info.count}`);

  // pravidla pro revokaci
  if (info.ips.size > MAX_IPS) {
    warn(`⚠️ Revoking token ${jti} — used from ${info.ips.size} IPs`);
    revokeToken(jti);
    
    notifyBlockedIP?.({
      ip: ip || "unknown",
      reason: `Token used from multiple IPs (${[...info.ips].join(",")})`,
      userAgent,
      method: "TOKEN_USAGE",
      path,
      city: "Neznámé",
      headers: {},
    }).catch(()=>{});
    return true;
  }

  if (info.uas.size > MAX_UAS) {
    warn(`⚠️ Revoking token ${jti} — multiple UAs (${[...info.uas].join(",")})`);
    revokeToken(jti);
    notifyBlockedIP?.({
      ip: ip || "unknown",
      reason: `Token used with multiple User-Agents (${[...info.uas].join(",")})`,
      userAgent,
      method: "TOKEN_USAGE",
      path,
      city: "Neznámé",
      headers: {},
    }).catch(()=>{});
    return true;
  }

  if (info.count > MAX_REQUESTS) {
    warn(`⚠️ Revoking token ${jti} — excessive requests (${info.count})`);
    revokeToken(jti);
    notifyBlockedIP?.({
      ip: ip || "unknown",
      reason: `Token excessive requests (${info.count}) [jti=${jti}]`,
      userAgent,
      method: "TOKEN_USAGE",
      path,
      city: "Neznámé",
      headers: {},
    }).catch(()=>{});
    return true;
  }

  return false;
}

// pro debug/inspekci
export function getUsageInfo(jti) {
  return usage.get(jti);
}
