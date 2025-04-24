import mongoose from "mongoose";

// Black List 
const blacklistedIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    unique: true,
  },
  reason: {
    type: String,
    default: "Automatické blokování",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const BlacklistedIP = mongoose.model("BlacklistedIP", blacklistedIPSchema);
export default BlacklistedIP;
