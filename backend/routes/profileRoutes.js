import express from "express"
import chalk from "chalk"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getProfile } from "../controllers/profileController.js"

const router = express.Router()

console.log(chalk.white.bold("{profileRoutes.js} pripojeno"));

router.get(
    "/profile",
    validateApiKey("profile"),
    getProfile
)

export default router
