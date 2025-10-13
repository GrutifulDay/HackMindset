import express from "express"
import chalk from "chalk"
import { validateApiKey } from "../middlewares/validateApiKey.js"
// import stripUntruthVotes from "../middlewares/stripUntruthVotes.js"
import { getDigital } from "../controllers/digitalController.js"

const router = express.Router()

console.log(chalk.white.bold("{digitalRoutes.js} pripojeno"));

router.get(
    "/digitalSignpost",
    // stripUntruthVotes,
    validateApiKey("digitalSignpost"),
    getDigital
  )

export default router


