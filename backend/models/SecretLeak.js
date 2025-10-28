// import mongoose from "mongoose";

// model pro unik hesla 

// const SecretLeakSchema = new mongoose.Schema({
//   createdAt: { type: Date, default: Date.now, index: true, expires: 90 * 24 * 60 * 60 }, // vyprší za 90 dní
//   ip: { type: String, index: true },
//   path: String,
//   method: String,
//   ua: String,
//   ref: String,
//   src: { type: String }, // např. "detectSecretLeak"
//   foundKeys: [String],   // názvy proměnných, např. ["MONGO_URI", "JWT_SECRET"]
//   masked: { type: String }, // např. "MONGO_URI: mongodb+srv://u...:***@... "
//   hash: { type: String, index: true }, // HMAC/SHA256 értéke hodnoty (neodkrývá obsah)
//   critical: { type: Boolean, default: false },
//   notified: { type: Boolean, default: false },
//   notifyCount: { type: Number, default: 0 },
//   meta: mongoose.Schema.Types.Mixed, // volitelné další info (redigované headers,...)
// }, { versionKey: false });

// export default mongoose.model("SecretLeak", SecretLeakSchema, "secretleaks");
