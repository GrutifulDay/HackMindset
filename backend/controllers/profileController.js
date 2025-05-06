import Profile from "../models/Profile.js"
import { getControllerDay } from "./dayController.js"

// kontrola data
export function getProfile(req, res) {
    return getControllerDay(Profile, req, res)
}