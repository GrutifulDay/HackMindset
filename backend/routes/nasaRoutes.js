import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { fetchNasaImage } from "../controllers/nasaController.js"
import { NASA_API_FRONTEND } from "../config.js"

const router = express.Router()

 
console.log("{nasaRoutes.js} pripojeno");

router.get(
    "/nasa",
    validateApiKey(NASA_API_FRONTEND, "Zavolání /nasa routeru"),
    fetchNasaImage
)

export default router

