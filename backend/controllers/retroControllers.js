import Retro from "../models/Retro.js"
import { getControllerDay } from "./dayController.js"


// BUDE UNIVERZAL FCE
// dnesni datum 
export function getRetroMachine(req, res) {
    return getControllerDay(Retro, req, res)
}


