import express from "express";
import { getStoryOfTheDay } from "../controllers/storyController.js"

const router = express.Router()

router.get("/story-of-the-day", getStoryOfTheDay)

export default router