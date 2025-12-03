import Story from "../models/Story.js"
import Retro from "../models/Retro.js"
import Digital from "../models/Digital.js"
import { error } from "../utils/logger.js";


const sectionModels = {
  story: Story,
  retro: Retro,
  digital: Digital,
}

export async function reportUntruthByToday(req, res) {
  const { feedback, section, date } = req.body

  if (!Array.isArray(feedback) || !section || !date) {
    return res.status(400).json({ error: "Chybí některé pole: 'feedback', 'section' nebo 'date'" })
  }

  const Model = sectionModels[section]
  if (!Model) {
    return res.status(400).json({ error: `Neplatná sekce: ${section}` })
  }

  try {
    const doc = await Model.findOne({ date })

    if (!doc) {
      return res.status(404).json({ error: `Dokument pro datum ${date} v sekci '${section}' nenalezen` })
    }

    if (!doc.untruthVotes) {
      doc.untruthVotes = new Map()
    }

    feedback.forEach((key) => {
      const current = doc.untruthVotes.get(key) || 0
      doc.untruthVotes.set(key, current + 1)
    })

    await doc.save()

    res.status(200).json({
      success: true,
      updatedVotes: Object.fromEntries(doc.untruthVotes)
    })
  } catch (err) {
    error("❌ Chyba při ukládání hlasu:", err)
    res.status(500).json({ error: "Chyba serveru" })
  }
}
