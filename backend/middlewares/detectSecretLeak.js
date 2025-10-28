// // middlewares/detectSecretLeak.js
// import jwt from "jsonwebtoken";
// import { maskToken, notifyBlockedIP } from "../utils/discordNotification.js";
// import { addToBlacklist } from "./ipBlacklist.js";
// import { SENSITIVE_KEYS, CHROME_EXTENSION_ALL_URL, JWT_SECRET } from "../config.js";
// import { redactHeaders } from "../utils/redact.js";
// import { debug, warn, error } from "../utils/logger.js";
// import SecretLeak from "../models/SecretLeak.js";
// import { isRevoked } from "./tokenRevocation.js"; // uprav cestu podle projektu

// unik hesel 

// const secrets = {};
// for (const k of (SENSITIVE_KEYS || [])) {
//   if (process.env[k]) secrets[k] = String(process.env[k]);
// }

// export default function detectSecretLeak(options = {}) {
//   const blockOnLeak = !!options.blockOnLeak;
//   const blacklistOnLeak = !!options.blacklistOnLeak;
//   const criticalKeys = Array.isArray(options.criticalKeys) ? options.criticalKeys : [];
//   const notifyOnFound = typeof options.notifyOnFound === "function" ? options.notifyOnFound : null;

//   return async function (req, res, next) {
//     try {
//       // 0) Ignore preflight (OPTIONS) — obvykle neobsahuje tělo
//       if (req.method === "OPTIONS") return next();

//       // složíme "haystack" — vše v hlavičkách, query a body jako string
//       const headerValues = Object.values(req.headers || {}).map(String);
//       const queryString = JSON.stringify(req.query || {});
//       const bodyString = JSON.stringify(req.body || {});
//       const haystack = [...headerValues, queryString, bodyString].join("||");

//       const found = [];
//       for (const [name, val] of Object.entries(secrets)) {
//         if (!val) continue;
//         if (haystack.includes(val)) {
//           found.push({ name, value: val });
//         }
//       }

//       if (found.length === 0) {
//         debug("detectSecretLeak: nic nalezeno");
//         if (notifyOnFound) notifyOnFound(req, found);
//         return next();
//       }

//       // Nalezeno citlivé
//       const maskedSummary = found.map(f => `${f.name}: ${maskToken(f.value)}`).join(", ");
//       const foundNames = found.map(f => f.name);
//       const criticalFound = found.some(f => criticalKeys.includes(f.name));

//       warn(`🔒 Možný únik citlivých údajů nalezen: ${foundNames.join(", ")}`);
//       debug(`detectSecretLeak - maskované nálezy: ${maskedSummary}`);

//       // 1) Pokus o ověření JWT — pokud je přítomen a validní + extId souhlasí, povolíme (nehlásíme)
//       const rawAuth = req.headers.authorization || "";
//       const token = rawAuth.startsWith("Bearer ") ? rawAuth.slice(7) : null;
//       if (token) {
//         try {
//           const decoded = jwt.verify(token, JWT_SECRET);
//           const okExt = decoded?.extId === CHROME_EXTENSION_ALL_URL;
//           const okSub = decoded?.sub === "chrome-extension";
//           const okAud = decoded?.aud && String(decoded.aud).includes("/api");
//           const revoked = decoded?.jti ? await isRevoked(decoded.jti) : false;

//           debug("detectSecretLeak: jwt check:", { okExt, okSub, okAud, revoked });

//           if (okExt && okSub && okAud && !revoked) {
//             // Legitimus request z extension — NEUPOŘÁDAT NOTIFIKACI ani DB záznam
//             debug("detectSecretLeak: legitimní request z rozšíření (JWT validní) — preskakuju alarm.");
//             return next();
//           }
//         } catch (e) {
//           // token invalid — pokračujeme jako leak
//           debug("detectSecretLeak: jwt verify failed or invalid:", e.message || e);
//         }
//       }

//       // 2) Pokud jsme sem došli, považujeme to za únik -> uložíme + notifikujeme + případně blacklist
//       try {
//         await SecretLeak.create({
//           ip: req.ip || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "Unknown",
//           path: req.originalUrl,
//           method: req.method,
//           ua: req.get("User-Agent") || "Unknown",
//           ref: req.get("referer"),
//           src: "detectSecretLeak",
//           foundKeys: foundNames,
//           masked: maskedSummary,
//           meta: { headers: redactHeaders(req.headers || {}) }
//         });
//       } catch (err) {
//         error("detectSecretLeak: chyba při ukládání do SecretLeak DB:", err.message || err);
//       }

//       try {
//         await notifyBlockedIP({
//           ip: req.ip || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "Unknown",
//           city: "Unknown",
//           userAgent: req.get("User-Agent") || "Unknown",
//           reason: `Possible secret leak (${foundNames.join(", ")})`,
//           method: req.method,
//           path: req.originalUrl,
//           headers: redactHeaders(req.headers || {}),
//           maskedSecrets: maskedSummary,
//           critical: criticalFound,
//         });
//       } catch (notifyErr) {
//         error("detectSecretLeak: chyba při odesílání notifikace:", notifyErr.message || notifyErr);
//       }

//       if (blacklistOnLeak) {
//         try {
//           await addToBlacklist(
//             req.ip || req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "Unknown",
//             `Secret leak: ${foundNames.join(", ")}`,
//             { userAgent: req.get("User-Agent"), method: req.method, path: req.originalUrl }
//           );
//         } catch (blErr) {
//           error("detectSecretLeak: chyba při přidávání do blacklistu:", blErr.message || blErr);
//         }
//       }

//       // blokace pokud kritický nebo blockOnLeak flag
//       if (criticalFound || blockOnLeak) {
//         warn("detectSecretLeak: blokován request kvůli úniku tajemství.");
//         return res.status(403).json({ error: "Request denied (sensitive data leak detected)" });
//       }

//     } catch (err) {
//       error("detectSecretLeak error:", err.message || err);
//     }

//     return next();
//   };
// }
