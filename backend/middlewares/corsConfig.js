import cors from "cors";
import { CHROME_EXTENSION_ALL_URL } from "../config.js";

// Whitelist povolených originů
const allowedOrigins = [
  "http://127.0.0.1:5501",
  CHROME_EXTENSION_ALL_URL,
  "https://hackmindset.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Povolí požadavek, pokud není origin nebo je v whitelistu
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
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





