import { fetchNasaImage } from "../controllers/nasaController.js"
import { getDigital } from "../controllers/digitalController.js"; 
import { getStoryOfTheDay } from "../controllers/storyController.js"
import { getRetroMachine } from "../controllers/retroControllers.js"
import { getProfile } from "../controllers/profileController.js"

// interni refresh vsech sekcí – pres controllery, zadny fetch
let isRefreshing = false;

export async function refreshAllSections() {
  if (isRefreshing) {
    console.log("⚠️ [refreshAll] Refresh už probíhá – přeskočeno.");
    return;
  }

  isRefreshing = true;
  console.log("♻️ [refreshAll] Spouštím interní refresh všech sekcí...");

  try {
    const fakeReq = { internal: true };
    const fakeRes = { json: () => {} };

    await fetchNasaImage(fakeReq, fakeRes);
    await getDigital(fakeReq, fakeRes);
    await getStoryOfTheDay(fakeReq, fakeRes);
    await getRetroMachine(fakeReq, fakeRes);
    await getProfile(fakeReq, fakeRes);

    console.log("✅ [refreshAll] Všechny sekce úspěšně přednačteny (interně).");
  } catch (err) {
    console.error("❌ [refreshAll] Chyba při interním refreshi:", err.message);
  } finally {
    isRefreshing = false;
  }
}

