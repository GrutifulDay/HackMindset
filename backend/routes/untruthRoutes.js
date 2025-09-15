import express from "express";
import {reportUntruthByToday} from "../controllers/untruthVotesController.js"
import { validateApiKey } from "../middlewares/validateApiKey.js"

const router = express.Router()

router.post(
    "/untruth-votes",
    validateApiKey("Zavolání POST /untruth-votes"),
    reportUntruthByToday
)

export default router