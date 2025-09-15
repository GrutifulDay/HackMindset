import express from "express";
import { validateApiKey } from "../middlewares/validateApiKey.js";
import { postUntruthLimit } from "../controllers/untruthLimitController.js";

const router = express.Router()

router.post(
    "/untruth-limit-log",
    validateApiKey("Zavolání /untruth-limit-log routeru"),
    postUntruthLimit
)

export default router