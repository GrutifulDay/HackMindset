import mongoose from "mongoose";
import { MONGO_URI_FRONTEND } from "../config.js";
import chalk from "chalk";

let frontendConnection;

export default function connectFrontendDB() {
  try {
    frontendConnection = mongoose.createConnection(MONGO_URI_FRONTEND)
  

    frontendConnection.on("connected", () => {
      console.log(chalk.green.bold("✅ Připojeno k MongoDB frontendData"));
    });

    frontendConnection.on("error", (err) => {
      console.error(chalk.red.bold("❌ Chyba v připojení k frontendData:", err));
    });

    return frontendConnection;
  } catch (error) {
    console.error(chalk.red.bold("❌ Nepodařilo se připojit k frontendData:", error));
  }
}
