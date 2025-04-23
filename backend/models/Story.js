import mongoose from "mongoose";
import connectFrontendDB from "../db/connectFrontendDB.js";

const frontendConnection = connectFrontendDB();

const storySchema = new mongoose.Schema({
  date: String,
  title: String,
  content: String,
  emoji: String
})

// Připoj model ke konkrétní connection
export default frontendConnection.model("story", storySchema);
