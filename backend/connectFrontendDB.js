import mongoose from "mongoose";
import { MONGO_URI_FRONTEND } from "./config.js";

let frontendConnection;

export default function connectFrontendDB() {
  try {
    frontendConnection = mongoose.createConnection(MONGO_URI_FRONTEND)
  

    frontendConnection.on("connected", () => {
      console.log("✅ Připojeno k databázi frontendData (samostatné spojení)");
    });

    frontendConnection.on("error", (err) => {
      console.error("❌ Chyba v připojení k frontendData:", err);
    });

    return frontendConnection;
  } catch (error) {
    console.error("❌ Nepodařilo se připojit k frontendData:", error);
  }
}
