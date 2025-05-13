import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getStoryOfTheDay } from "../controllers/storyController.js"
import { HACK_EXTENSION } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/story-of-the-day",
    validateApiKey(HACK_EXTENSION, "Zavolání /story-of-the-day routeru"),
    getStoryOfTheDay
)

export default router

