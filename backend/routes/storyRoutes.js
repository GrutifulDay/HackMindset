import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getStoryOfTheDay } from "../controllers/storyController.js"
import { getStoryVotes, addStoryVote } from "../controllers/storyVotesController.js"
import { HACK_EXTENSION } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/story-of-the-day",
    validateApiKey(HACK_EXTENSION, "Zavolání /story-of-the-day routeru"),
    getStoryOfTheDay
)

router.get(
    "/story-of-the-day/storyVotesGet/:date",
    validateApiKey(HACK_EXTENSION, "Zavolání GET /storyVotesGet"),
    getStoryVotes
)

router.post(
    "/story-of-the-day/storyVotesPost",
    validateApiKey(HACK_EXTENSION, "Zavolání POST /storyVotesPost"),
    addStoryVote
)

export default router

