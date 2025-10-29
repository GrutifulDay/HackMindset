import { API } from "../config.js";
import { debug, error } from "../logger/logger.js";

let jwtToken = null;
let tokenExpiry = null; // kdy token vyprsi

function decodeJwt(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export async function getJwtToken() {
  const now = Date.now();

  if (jwtToken && tokenExpiry && now < tokenExpiry - 5000) {
    return jwtToken;
  }

  try {
    const res = await fetch(API.getToken, 
      { 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer HACK_MINDSET"
        }
       });
    if (!res.ok) {
      throw new Error("❌ Nelze získat JWT token");
    }

    const data = await res.json();
    jwtToken = data.token;

    const decoded = decodeJwt(jwtToken);
    tokenExpiry = decoded.exp * 1000; 

    debug("🔐 Nový JWT token získán, exp:", new Date(tokenExpiry).toLocaleTimeString());

    return jwtToken;
  } catch (err) {
    error("❌ Chyba při získávání JWT tokenu:", err);
    return null;
  }
}