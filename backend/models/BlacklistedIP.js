import mongoose from "mongoose";

// Black List 
const blacklistedIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    default: "Neznámá IP",
    // required: true, // musi byt zadana hodnota, jinak se neulozi
    unique: true, // neopakuje se
  },
  userAgent: {
    type: String,
    default: "Neznámý", // muze byt doplneno pri detekci
  },
  browser: {
    type: String,
    default: "Neznámý",
  },
  os: {
    type: String,
    default: "Neznámý",
  },
  deviceType: {
    type: String,
    default: "Neznámý",
  },
  reason: {
    type: String,
    default: "Automatické blokování",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  city: {
    type: String,
    default: "Neznámý"
  }
});

const BlacklistedIP = mongoose.model("BlacklistedIP", blacklistedIPSchema);
export default BlacklistedIP;
