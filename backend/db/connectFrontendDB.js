// db/connectFrontendDB.js

import mongoose from "mongoose"
import { MONGO_URI_FRONTEND } from "../config.js"
import chalk from "chalk"

let frontendConnection

export default function connectFrontendDB() {
  try {
    frontendConnection = mongoose.createConnection(MONGO_URI_FRONTEND, {
      dbName: "frontendData"  
    })

    frontendConnection.on("connected", () => {
      console.log(chalk.green.bold("✅ Připojeno k MongoDB"));
    })

    frontendConnection.on("error", (err) => {
      console.error(chalk.red.bold("❌ Chyba v připojení k MongoDB:", err.message));
    });

    return frontendConnection
  } catch (error) {
    console.error(chalk.red.bold("❌ Nepodařilo se připojit k MongoDB:", error.message));
  }
}
