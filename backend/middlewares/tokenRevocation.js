import { notifyBlockedIP } from "../utils/discordNotification.js";
import { debug, info, warn, error } from "../utils/logger.js";

const revokedTokens = new Set();

export function revokeToken(jti, meta = {}) {
  revokedTokens.add(jti);
  debug("🚫 Revokován token s JTI:", jti);

  // discord notifikace
  notifyBlockedIP?.({
    ip: meta.ip || "Neznámá",
    city: meta.city || "Neznámé",
    userAgent: meta.userAgent || "Neznámý",
    reason: `Token revoked [jti=${jti}]`,
    method: meta.method || "REVOKE",
    path: meta.path || "/api/revoke-token",
    headers: meta.headers || {},
  }).catch(() => {});
}

export function isRevoked(jti) {
  return revokedTokens.has(jti);
}
