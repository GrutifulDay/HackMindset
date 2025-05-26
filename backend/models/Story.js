import mongoose from "mongoose";
import connectFrontendDB from "../db/connectFrontendDB.js";

const frontendConnection = connectFrontendDB()

const storySchema = new mongoose.Schema({
  date: String,
  title: {
    cz: String,
    en: String
  },
  content: {
    cz: String,
    en: String
  },
  emoji: String,
  like: String,
  dislike: String
})

export default frontendConnection.model("story", storySchema)
