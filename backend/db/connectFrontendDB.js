import mongoose from "mongoose"
import { MONGO_URI_FRONTEND } from "../config.js"
import { info, error } from "../utils/logger.js";

let frontendConnection

export default function connectFrontendDB() {
  try {
    frontendConnection = mongoose.createConnection(MONGO_URI_FRONTEND, {
      dbName: "frontendData"  
    })

    frontendConnection.on("connected", () => {
      info("✅ Připojeno k MongoDB")
    })

    frontendConnection.on("error", (err) => {
      error("❌ Chyba v připojení k MongoDB:", err.message)
    });

    return frontendConnection
  } catch (err) {
    error("❌ Nepodařilo se připojit k MongoDB:", err.message);
  }
}
