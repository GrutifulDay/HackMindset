import mongoose from "mongoose";
import chalk from "chalk";
import { MONGO_URI } from "../config.js";

// pripojeni DB 
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5s snaha pripojit se, pak hodi chybu, rychlejsi
    });

    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;

    console.log(chalk.green.bold(`✅ MongoDB connected to ${host}/${dbName}`));
  } catch (err) {
    console.error(chalk.red.bold("❌ MongoDB error:"), err.message);
    process.exit(1);
  }
};

export default connectDB;
