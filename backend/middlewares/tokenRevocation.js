// 🧱 In-memory seznam revokovaných tokenů (zmizi po restartu serveru)
const revokedTokens = new Set();

// fce pro revokaci tokenu (např. pri podezreni nebo logoutu)
export function revokeToken(jti) {
  revokedTokens.add(jti);
  console.log("🚫 Revokován token s JTI:", jti);
}

// overeni, zda token byl revokovan
export function isRevoked(jti) {
  return revokedTokens.has(jti);
}
