import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { fetchNasaImage } from "../controllers/nasaController.js"
import { HACK_EXTENSION } from "../config.js"

const router = express.Router()

 
console.log("{nasaRoutes.js} pripojeno");

router.get(
    "/nasa",
    validateApiKey(HACK_EXTENSION, "Zavolání /nasa routeru"),
    fetchNasaImage
)

export default router

