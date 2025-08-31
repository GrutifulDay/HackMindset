import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import stripUntruthVotes from "../middlewares/stripUntruthVotes.js"
import { getRetroMachine } from "../controllers/retroControllers.js"
import { getRetroVotes, addRetroVote } from "../controllers/retroVotesController.js"
import { HACK_EXTENSION } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/retro-machine",
    stripUntruthVotes,
    validateApiKey(HACK_EXTENSION, "Zavolání /retro-machine routeru"),
    getRetroMachine
)

router.get(
    "/retro-machine/retroVotesGet/:date",
    stripUntruthVotes,
    validateApiKey(HACK_EXTENSION, "Zavolání GET /retroVotesGet"),
    getRetroVotes
)

router.post(
    "/retro-machine/retroVotesPost",
    stripUntruthVotes,
    validateApiKey(HACK_EXTENSION, "Zavolání POST /retroVotesPost"),
    addRetroVote
)

export default router

