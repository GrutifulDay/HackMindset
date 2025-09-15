import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getStoryOfTheDay } from "../controllers/storyController.js"
import { getStoryVotes, addStoryVote } from "../controllers/storyVotesController.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/story-of-the-day",
    validateApiKey("Zavolání /story-of-the-day routeru"),
    getStoryOfTheDay
)

router.get(
    "/story-of-the-day/storyVotesGet/:date",
    validateApiKey("Zavolání GET /storyVotesGet"),
    getStoryVotes
)

router.post(
    "/story-of-the-day/storyVotesPost",
    validateApiKey("Zavolání POST /storyVotesPost"),
    addStoryVote
)

export default router

