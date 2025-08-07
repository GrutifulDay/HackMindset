import crypto from "crypto"
import chalk from "chalk"
import HoneySession from "../models/FeedbackHoney.js"

export async function feedbackHoneyPoint(req, res) {
  console.log("🎯 Honeypoint byl aktivován přes /feedbackForm")

  // 🎯 Aktivace honeypointu – generování náhodného session ID (např. "4f9a3bd1e7a2")
  const sessionId = crypto.randomBytes(8).toString("hex")

  // 🖨️ Vypiš ID do terminálu pro sledování
  console.log(chalk.yellow.bold(`💡 Nový honeypoint sessionId: ${sessionId}`))

  // 💾 Uložení do DB – ID + IP + user agent + čas
  const session = new HoneySession({
    sessionId,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    referer: req.get("Referer") || "neznámý referer",
    notes: "Honeypoint aktivován přes formulář"
  })

  try {
    await session.save()
    console.log(chalk.green("✅ Honeypoint session uložena do DB"))
  } catch (err) {
    console.error(chalk.red("❌ Chyba při ukládání session do DB:"), err.message)
  }

  // 🔄 Přesměrování můžeš řešit později (např. pomocí fetch do jiného serveru)
  // fetch(`https://honeypoint.mojedomena.cz/api/start`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ sessionId })
  // })

  // 🕵️‍♀️ Falešná odpověď jako návnada
  const fakeUser = {
    id: "u9843-f9a2b01",
    username: "internal-tester42",
    status: "🟢 Aktivní",
    lastLogin: "2025-07-30T10:15:00Z",
    permissions: ["read:feedback", "view:internal"],
    token: "null", 
  }

  return res.status(200).json({
    message: "🧪 Systémový přístup potvrzen - test form",
    user: fakeUser
  })
}
