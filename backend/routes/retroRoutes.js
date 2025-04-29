import express from "express";
import Retro from "../models/Retro.js";
import { getRetroMachineControllers } from "../controllers/retroControllers.js"
const router = express.Router()

console.log("{retroRoutes.js} pripojeno");

router.get("/retro-machine", async (req,res) => {
    try {
        const data = await Retro.find()
        res.json(data)
    } catch (error) {
        console.error("❌ Chyba při načítání retro dat:", error);
        res.status(500).json({ error: "Chyba při načítání dat" });
    }
})

router.get("/retro-today", getRetroMachineControllers);

export default router