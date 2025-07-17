// controllers/untruthLimitController.js
import UntruthLog from "../models/UntruthLog.js"

export async function postUntruthLimit(req, res) {
  try {
    const { section, date } = req.body

    if (!section || !date) {
      return res.status(400).json({ error: "Chybí parametr 'section' nebo 'date'" })
    }

    let log = await UntruthLog.findOne({ date })

    if (log) {
      log[section].abuseCount += 1;
      await log.save()
      return res.status(200).json({
        message: `Záznam navýšen pro sekci ${section}`,
        abuseCount: log[section].abuseCount
      })
    } else {
      // Vytvoreni noveho zaznamu 
      const newLog = new UntruthLog({
        date,
        story: { abuseCount: section === "story" ? 1 : 0 },
        retro: { abuseCount: section === "retro" ? 1 : 0 },
        digital: { abuseCount: section === "digital" ? 1 : 0 }
      })
      await newLog.save()
      return res.status(201).json({
        message: "Vytvořen nový záznam",
        abuseCount: 1
      })
    }
  } catch (error) {
    console.error("❌ Chyba v postUntruthLimit:", error);
    res.status(500).json({ error: "Interní chyba serveru" });
  }
}





