import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { fetchNasaImage } from "../controllers/nasaController.js"

const router = express.Router()

console.log("{nasaRoutes.js} pripojeno");

router.get(
    "/nasa",
    validateApiKey("Zavolání /nasa routeru"),
    fetchNasaImage
)

export default router

