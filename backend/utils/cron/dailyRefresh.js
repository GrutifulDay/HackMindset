// cron/dailyRefresh.js
import cron from "node-cron";
import { refreshAllSections } from "../refreshAll.js";

// refresh kazdy den v urcity cas 
export function startDailyCron() {
  cron.schedule("32 09 * * *", async () => {
    console.log("🕛 [CRON] Spouštím noční refresh všech sekcí...");
    try {
      await refreshAllSections();
      console.log("✅ [CRON] Přednačtení všech sekcí dokončeno.");
    } catch (err) {
      console.error("❌ [CRON] Chyba při nočním refreshi:", err.message);
    }
  });
}
