import { API } from "../config.js";
import { debug, error } from "../logger/logger.js";
import { warn } from "../logger/logger.js";

let jwtToken = null;
let tokenExpiry = null;

// helper: dekóduj JWT
function decodeJwt(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export async function getJwtToken() {
  const now = Date.now();

  // Pokud má token ještě 5s platnost
  if (jwtToken && tokenExpiry && now < tokenExpiry - 5000) {
    return jwtToken;
  }

  try {
    const res = await fetch(API.getToken, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer EXTENSION_SIGNATURE"
      }
    });

    // ❗ ZDE přidáme bezpečnou kontrolu
    if (!res.ok) {
      warn("[WARN] getJwtToken → server odmítl token:", res.status);

      jwtToken = null;        // vynuluj
      tokenExpiry = null;     // vynuluj

      return null;            // klíčový krok – žádný throw
    }

    const data = await res.json();

    // ❗ Další bezpečná kontrola
    if (!data?.token) {
      warn("[WARN] getJwtToken → token není v odpovědi:", data);

      jwtToken = null;
      tokenExpiry = null;

      return null;
    }

    jwtToken = data.token;

    const decoded = decodeJwt(jwtToken);
    tokenExpiry = decoded.exp * 1000;

    debug("🔐 Nový JWT token získán, exp:", new Date(tokenExpiry).toLocaleTimeString());

    return jwtToken;

  } catch (err) {
    error("❌ Chyba při získávání JWT tokenu:", err);

    jwtToken = null;
    tokenExpiry = null;

    return null;
  }
}
