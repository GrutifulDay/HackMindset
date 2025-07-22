import Story from "../models/Story.js";
import { getControllerDay } from "./dayController.js";

// kontrola dnesniho datumu z db
export function getStoryOfTheDay(req, res) {
  return getControllerDay(Story, req, res);
}
