import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getRetroMachine } from "../controllers/retroControllers.js"
import { RETRO_API_FRONTEND } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get(
    "/retro-machine",
    validateApiKey(RETRO_API_FRONTEND, "Zavolání /retro-machine routeru"),
    getRetroMachine
)

export default router

