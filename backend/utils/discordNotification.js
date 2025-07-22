import { DISCORD_WEBHOOK_URL } from "../config.js";

export async function notifyBlockedIP(
  ip,
  city = "Neznámé",
  userAgent = "Neznámé",
  reason = "Zablokováno kvůli podezřelé aktivitě"
) {
  const webhookUrl = DISCORD_WEBHOOK_URL;

  const message = {
    content: `🚫 **IP ${ip} byla zablokována**\n📄 Důvod: *${reason}*\n🕒 ${new Date().toLocaleString("cs-CZ")}*\n 🌏 Město: *${city || "Neznámé"}*\n 💻 User-Agent: *${userAgent || "Neznámé"}*`,
  };

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    console.log(`✅ Notifikace o blokaci IP ${ip} odeslána na Discord, mesto ${city}. `);
  } catch (error) {
    console.error("❌ Chyba při odesílání na Discord:", error.message);
  }
}
