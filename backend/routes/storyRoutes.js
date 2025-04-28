import express from "express";
import { controllerDayOfStory } from "../controllers/storyController.js"

const router = express.Router()

router.get("/story-of-the-day", controllerDayOfStory)

export default router