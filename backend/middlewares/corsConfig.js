import cors from "cors";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";

// Whitelist
const allowedOrigins = [
  "http://127.0.0.1:5501",          
  "https://hackmindset.app",        
  CHROME_EXTENSION_ALL_URL         
];

// fce pro budouci logovani
const logBlockedOrigin = (origin) => {
  console.warn(`[CORS BLOCKED] Origin: ${origin || "null"} - ${new Date().toISOString()}`);
  // TODO: sendToDiscord(`[CORS BLOCKED] Origin: ${origin || "null"}`)

  // sendToDiscord(`🚫 *CORS BLOCKED:*\nOrigin: ${origin}`); - pozdeji 

};

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      // Preflight nebo CLI nástroj – můžeš bloknout nebo povolit
      return callback(null, false); // Bloknout tiše bez chyby
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // nepovoleny origin – loguj a tiše zablokuj (bez 500 chyby)
    logBlockedOrigin(origin);
    return callback(null, false);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

export default cors(corsOptions);




// import cors from "cors";
// import { CHROME_EXTENSION_ALL_URL } from "../config.js";

// // Funkce pro logování (pro ladění)
// const log = (message) => console.log(`[CORS] ${message} - ${new Date().toLocaleString('cs-CZ', { timeZone: 'CET' })}`)

// // Dynamická konfigurace CORS
// const corsOptions = {
//   origin: (origin, callback) => {
//     const allowedOrigins = [
//       "http://127.0.0.1:5501", // Vývojový server (pouze pro testování)
//       "https://localhost:3000", // Tvůj server (HTTPS)
//       CHROME_EXTENSION_ALL_URL // ID rozšíření (např. chrome-extension://<id>/*)
//     ]

//     log(`Kontrola původu: ${origin || 'null'}`)
//     if (!origin || allowedOrigins.includes(origin)) {
//       log(`Povolen původ: ${origin || 'Chrome rozšíření'}`)
//       callback(null, true)
//     } else {
//       log(`Blokován původ: ${origin}`)
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   methods: ["GET", "POST", "OPTIONS"], // Flexibilita pro různé požadavky
//   credentials: true, // Povolení cookies/autorizace
//   allowedHeaders: ["Content-Type", "Authorization"], // Povolené hlavičky
//   optionsSuccessStatus: 200 // Vrácení 200 pro OPTIONS
// }

// // Export middleware
// export default cors(corsOptions)





