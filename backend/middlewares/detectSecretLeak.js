// import { maskToken, notifyBlockedIP } from "../utils/discordNotification.js";
// import { saveSecurityLog } from "../services/securityLogService.js";
// import { addToBlacklist } from "./ipBlacklist.js"; 
// import { SENSITIVE_KEYS } from "../config.js";

// // sestav mapu název -> value (tajemství)
// const secrets = {};
// for (const k of (SENSITIVE_KEYS || [])) {
//   if (process.env[k]) secrets[k] = String(process.env[k]);
// }

// export default function detectSecretLeak(options = {}) {
//   const blockOnLeak = !!options.blockOnLeak;
//   const blacklistOnLeak = !!options.blacklistOnLeak;

//   return async function (req, res, next) {
//     try {
//       const headerValues = Object.values(req.headers || {}).map(String);
//       const queryString = JSON.stringify(req.query || {});
//       const bodyString = JSON.stringify(req.body || {});

//       const haystack = [ ...headerValues, queryString, bodyString ].join("||");

//       const found = [];
//       for (const [name, val] of Object.entries(secrets)) {
//         if (val && haystack.includes(val)) {
//           found.push({ name, value: val });
//         }
//       }

//       if (found.length > 0) {
//         // 👇 použijeme přímo maskToken
//         const summary = found
//           .map(f => `${f.name}: ${maskToken(f.value)}`)
//           .join(", ");

//         // Discord notifikace
//         await notifyBlockedIP({
//           ip: req.ip || req.headers["x-forwarded-for"] || "Unknown",
//           city: "Unknown",
//           userAgent: req.get("User-Agent") || "Unknown",
//           reason: `Possible secret leak (${found.map(f => f.name).join(", ")})`,
//           method: req.method,
//           path: req.originalUrl,
//           headers: {},
//           maskedSecrets: summary   // ✨ maskované hodnoty
//         });

//         if (blacklistOnLeak) {
//           await addToBlacklist(
//             req.ip || req.headers["x-forwarded-for"] || "Unknown",
//             `Secret leak: ${found.map(f => f.name).join(", ")}`,
//             { userAgent: req.get("User-Agent"), method: req.method, path: req.originalUrl }
//           );
//         }

//         if (blockOnLeak) {
//           return res.status(403).json({ error: "Request denied" });
//         }
//       }
//     } catch (err) {
//       console.error("detectSecretLeak error:", err.message || err);
//     }
//     return next();
//   };
// }
