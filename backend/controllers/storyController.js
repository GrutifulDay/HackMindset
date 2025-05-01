import Story from "../models/Story.js"
import { getControllerDay } from "./dayController.js"

export function getStoryOfTheDay(req, res) {
    return getControllerDay(Story, req, res)
}

