import dayjs from "dayjs"

export async function getControllerDay(Model, req, res, options = {}) {
    try {
        const today = dayjs().format("DD-MM")
        const document = await Model.findOne({ date: today })

        if (!document) {
            return res.status(404).json({ error: "❌ Nenalezeno" })
        }

        if (options.excludeDate) {
            const { date, ...cleaned } = document.toObject()
            return res.json(cleaned)
        }

        res.json(document)
    } catch (error) {
        res.status(500).json({ error: "❌ Chyba serveru" })
    }
}