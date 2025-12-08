import Profile from "../models/Profile.js"
import { getControllerDay } from "./dayController.js"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// kompatibilni JSON nacitani
const dataProfile = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../demo-data/profile.json"), "utf8")
  );

// kontrola data
export function getProfile(req, res) {
    return getControllerDay(Profile, req, res, {demoData: dataProfile})
}