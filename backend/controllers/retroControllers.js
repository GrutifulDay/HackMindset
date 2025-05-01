import Retro from "../models/Retro.js"
import { getControllerDay } from "./dayController.js"

// kontrola dnesniho datumu z db
export function getRetroMachine(req, res) {
    return getControllerDay(Retro, req, res)
}


