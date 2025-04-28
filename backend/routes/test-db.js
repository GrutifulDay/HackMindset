// import express from "express";
// import { UAParser } from "ua-parser-js";
// import { addToBlacklist } from "../middlewares/ipBlacklist.js";
// import { TOKEN_IP_CITY } from "../config.js"

// const router = express.Router();

// const getCityByIP = async (ip) => {
//     const realIP =
//       ip === "::1" || ip === "::ffff:127.0.0.1" || ip === "127.0.0.1"
//         ? "8.8.8.8" // náhrada localhostu za veřejnou IP
//         : ip;
  
//     const token = TOKEN_IP_CITY
  
//     try {
//       const response = await fetch(`https://ipinfo.io/${realIP}/json?token=${token}`);
//       const data = await response.json();
//       console.log("🔍 Data z ipinfo.io:", data);
//       return data.city || "Neznámé město";
//     } catch (err) {
//       console.error("❌ Chyba při získávání města:", err.message);
//       return "Neznámé město";
//     }
//   };
  


// router.get("/test-db", async (req, res) => {
//   const userIP = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "neznámá IP";
//   const userAgentString = req.get("User-Agent") || "Neznámý";
//   const parser = new UAParser(userAgentString);
//   const result = parser.getResult();

//   const city = await getCityByIP(userIP);

//   await addToBlacklist(userIP, "Test logování s městem", {
//     userAgent: userAgentString,
//     browser: result.browser.name,
//     os: result.os.name,
//     deviceType: result.device.type,
//     city: city
//   });

//   res.json({
//     message: "Uloženo do DB i s městem",
//     ip: userIP,
//     city: city,
//     parsed: result
//   });
// });

// export default router;
