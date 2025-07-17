import cors from "cors"
import { CHROME_EXTENSION_ALL_URL } from "../config.js";

const corsOptions = {
    origin: [ "http://127.0.0.1:5501", 
    CHROME_EXTENSION_ALL_URL ], // moje ID 
    methods: ["GET"], //povoleni HTTP metody
    credentials: true, // povoleno prenosu cookies pokud bude potreba 
    allowedHeaders: [ "Content-Type", "Authorization" ], //povolene hlavicky requestu
}

export default cors(corsOptions)


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





