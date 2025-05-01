import Story from "../models/Story.js"
import dayjs from "dayjs"

// BUDE UNIVERZAL FCE
// dnesni datum 
export async function getStoryOfTheDay(req, res) {
    try {
        const today = dayjs().format("DD-MM")
        const story = await Story.findOne({ date: today })
        
        if (!story) {
            return res.status(404).json({ error: "❌ Nenalezeno" })
        }

        res.json(story)
    } catch (error) {
        res.status(500).json({ error: "❌ Chyba serveru"})
    }
}

