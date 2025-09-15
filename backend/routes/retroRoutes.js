import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getRetroMachine } from "../controllers/retroControllers.js"
import { getRetroVotes, addRetroVote } from "../controllers/retroVotesController.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/retro-machine",
    validateApiKey("Zavolání /retro-machine routeru"),
    getRetroMachine
)

router.get(
    "/retro-machine/retroVotesGet/:date",
    validateApiKey("Zavolání GET /retroVotesGet"),
    getRetroVotes
)

router.post(
    "/retro-machine/retroVotesPost",
    validateApiKey("Zavolání POST /retroVotesPost"),
    addRetroVote
)

export default router

