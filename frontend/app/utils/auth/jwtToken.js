import { API } from "../config.js";

let jwtToken = null;
let tokenExpiry = null; // kdy token vyprsi

// helper: dekóduj JWT (bez ověření signatury – jen base64 decode)
function decodeJwt(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

export async function getJwtToken() {
  const now = Date.now();

  // pokud ma token jeste 5s platnosti -> vrati
  if (jwtToken && tokenExpiry && now < tokenExpiry - 5000) {
    return jwtToken;
  }

  try {
    const res = await fetch(API.getToken, 
      { 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-hackmindset": "HACK_MINDSET"
        }
       });
    if (!res.ok) {
      throw new Error("❌ Nelze získat JWT token");
    }

    const data = await res.json();
    jwtToken = data.token;

    // dekóduj exp claim
    const decoded = decodeJwt(jwtToken);
    tokenExpiry = decoded.exp * 1000; // ms

    console.log("🔐 Nový JWT token získán, exp:", new Date(tokenExpiry).toLocaleTimeString());

    return jwtToken;
  } catch (err) {
    console.error("❌ Chyba při získávání JWT tokenu:", err);
    return null;
  }
}
