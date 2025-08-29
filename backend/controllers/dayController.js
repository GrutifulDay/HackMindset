import dayjs from "dayjs"

export async function getControllerDay(Model, req, res, options = {}) {
  try {
    let targetDate

    if (options.weekly) {
      const today = dayjs()
      const monday = today.startOf("week").add(1, "day"); // startOf("week") = neděle → +1 = pondělí
      targetDate = monday.format("DD-MM-YYYY")
    } else {
      targetDate = dayjs().format("DD-MM-YYYY")
    }

    const document = await Model.findOne({ date: targetDate })

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
