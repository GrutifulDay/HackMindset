import Digital from "../models/Digital.js"
import { getControllerDay } from "./dayController.js"


export function getDigital(req, res) {
    return getControllerDay(Digital, req, res)
}