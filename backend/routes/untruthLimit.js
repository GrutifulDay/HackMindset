import express from "express";
import { validateApiKey } from "../middlewares/validateApiKey.js";
import { HACK_EXTENSION } from "../config.js";
import { postUntruthLimit } from "../controllers/untruthLimitController.js";

const router = express.Router();

router.post(
  "/untruth-limit-log",
  validateApiKey(HACK_EXTENSION, "Zavolání /untruth-limit-log routeru"),
  postUntruthLimit
);

export default router;
