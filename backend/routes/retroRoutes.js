import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getRetroMachine } from "../controllers/retroControllers.js"
import { HACK_EXTENSION } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/retro-machine",
    validateApiKey(HACK_EXTENSION, "Zavolání /retro-machine routeru"),
    getRetroMachine
)

export default router

