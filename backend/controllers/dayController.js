import dayjs from "dayjs"

export async function getControllerDay(Model, req, res, options = {}) {
  try {
    let target

    if (options.weekly) {
      // pondělí aktuálního týdne
      const monday = dayjs().startOf("week").add(1, "day")

      target = {
        year: monday.year(),
        month: monday.month() + 1, // dayjs měsíce = 0–11
        day: monday.date()
      }
    } else {
      const today = dayjs()

      target = {
        year: today.year(),
        month: today.month() + 1,
        day: today.date()
      }
    }

    const document = await Model.findOne(target)

    if (!document) {
      return res.status(404).json({ error: "Nenalezeno" })
    }

    // volitelně schovat datum
    if (options.excludeDate) {
      const { year, month, day, ...rest } = document.toObject()
      return res.json(rest)
    }

    res.json(document)

  } catch (err) {
    res.status(500).json({ error: "Chyba serveru" })
  }
}
