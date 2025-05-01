import express from "express";
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getStoryOfTheDay } from "../controllers/storyController.js"
import { STORY_API_FRONTEND } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/story-of-the-day",
    validateApiKey(STORY_API_FRONTEND, "Zavolání /story-of-the-day routeru"),
    getStoryOfTheDay
)

export default router

