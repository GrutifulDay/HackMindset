import mongoose from "mongoose";

// Black List 
const blacklistedIPSchema = new mongoose.Schema({
  ip: {
    type: String,
    default: "Neznámá IP",
    unique: true, // neopakuje se
  },
  userAgent: {
    type: String,
    default: "Neznámý",
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
  city: {
    type: String,
    default: "Neznámá",
  }, 
  method: {
    type: String,
    default: "Neznámá",
  },
  path: {
    type: String,
    default: "Neznámá",
  },
  headers: {
    type: Object, // uloží se JSON redaktnutých hlaviček
    default: {},
  },
  attempts: {
    type: Number,
    default: 1, // když zablokuješ poprvé, nastavíš 1 a pak můžeš inkrementovat
  },
  date: {
    type: Date,
    default: Date.now,
    expires: 86400, // 2592000 = 30 dní, 86400 = 24h
  }
}, { timestamps: true }); // přidá createdAt a updatedAt

const BlacklistedIP = mongoose.model("BlacklistedIP", blacklistedIPSchema);
export default BlacklistedIP;
