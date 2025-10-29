// import crypto from "crypto";

// export function hashIp(ip) {
//   if (!ip) return null;
//   return crypto.createHash("sha256").update(ip).digest("hex");
// }




import crypto from "crypto";
import { HASH_KEY } from "../config.js";

export function hashIp(ip) {
  if (!ip) return null;
  return crypto
    .createHmac("sha256", HASH_KEY)
    .update(ip)
    .digest("hex");
}
