import express from "express"
import chalk from "chalk"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { feedbackHoneyPoint } from "../controllers/feedbackController.js"

const router = express.Router()

console.log(chalk.red.bold("{feedbackRoutes.js} připojen"))

router.post(
    "/feedbackForm",
    validateApiKey("Zavolání /feedbackForm routeru"),
    feedbackHoneyPoint
  )

export default router
