import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
// import stripUntruthVotes from "../middlewares/stripUntruthVotes.js"
import { getStoryOfTheDay } from "../controllers/storyController.js"
import { getStoryVotes, addStoryVote } from "../controllers/storyVotesController.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/story-of-the-day",
    // stripUntruthVotes,
    validateApiKey("story-of-the-day"),
    getStoryOfTheDay
)

router.get(
    "/story-of-the-day/storyVotesGet/:date",
    // stripUntruthVotes,
    validateApiKey("story-of-the-day"),
    getStoryVotes
)

router.post(
    "/story-of-the-day/storyVotesPost",
    // stripUntruthVotes,
    validateApiKey("story-of-the-day"),
    addStoryVote
)

export default router

