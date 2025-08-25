import mongoose from "mongoose"

// Black List 
const blacklistedIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    default: "Neznámá IP",
    unique: true, // neopakuje se
  },
  userAgent: {
    type: String,
    default: "Neznámý", // muze byt dopneno pri detekci
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
    default: "Neznámá"
  }, 
  // expires: 2592000 // (TTL nastaveni) automaticky smaze po 30 dnech
})

const BlacklistedIP = mongoose.model("BlacklistedIP", blacklistedIPSchema)
export default BlacklistedIP
