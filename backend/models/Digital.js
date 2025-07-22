import mongoose from "mongoose";
import connectFrontendDB from "../db/connectFrontendDB.js";

const frontendConnection = connectFrontendDB();

const digitalSchema = new mongoose.Schema({
  date: String,
  title: {
    cz: String,
    en: String,
  },
  content: {
    cz: String,
    en: String,
  },
  recommendation: {
    cz: String,
    en: String,
  },
  untruthVotes: {
    type: Map,
    of: Number,
    default: {},
  },
});

export default frontendConnection.model("digital", digitalSchema);
