import crypto from "crypto";
import { HASH_KEY } from "../config.js";

export function hashIp(ip) {
  if (DEMO_MODE) return null;
  
  if (!ip) return null;
  return crypto
    .createHmac("sha256", HASH_KEY)
    .update(ip)
    .digest("hex");
}
