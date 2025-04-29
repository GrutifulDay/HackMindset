import Retro from "../models/Retro.js"
import dayjs from "dayjs"

// dnesni datum 
export async function getRetroMachineControllers(req, res) {
    try {
        const today = dayjs().format("DD-MM")
        const retro = await Retro.findOne({ date: today })
        
        if (!retro) {
            return res.status(404).json({ error: "Nenalezeno" })
        }

        const { date, ...cleanedRetro } = retro.toObject()

        res.json(cleanedRetro)
    } catch (error) {
        res.status(500).json({ error: "Chyba serveru"})
    }
}

