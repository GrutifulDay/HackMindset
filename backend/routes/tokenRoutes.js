import express from "express";
import { getToken } from "../controllers/tokenController.js";
import { validateToken } from "../middlewares/validateToken.js"; 
import { HACK_MINDSET } from "../config.js";

const router = express.Router();

router.get(
  "/get-token",
  validateToken(HACK_MINDSET, "Pokus o získání tokenu"), 
  getToken
);

export default router;