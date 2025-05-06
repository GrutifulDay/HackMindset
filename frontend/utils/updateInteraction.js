console.log("{updateInteractions.js} 🧹 připraven na úklid")
/**
 * Projde zadané localStorage klíče a odstraní jejich hodnoty,
 * pokud nejsou z dnešního dne.
 *
 * @param {string[]} keys - Pole klíčů (např. story_like, retro_like...)
 */

export function clearOldInteractions(keys = []) {
    const today = new Date().toISOString().slice(0, 10); // "2025-05-01"
  
    keys.forEach((key) => {
      const dateKey = `${key}_date`;
      const storedDate = localStorage.getItem(dateKey);
  
      if (storedDate !== today) {
        console.log(`🧹 Mazu hodnoty pro ${key}, ulozene: ${storedDate}`)
        localStorage.removeItem(key);
        localStorage.setItem(dateKey, today);
      }
    });
}

console.log("{clearOldInteractions.js} 🧹 připraven na testování")

// export function clearOldInteractions(keys = []) {
//   const now = new Date();
//   const today = now.toISOString().slice(0, 10); // např. "2025-05-01"
//   const currentHour = now.getHours();

//   console.log(`🕓 Teď je ${now.toLocaleTimeString()} | Dnes: ${today}`);

//   keys.forEach((key) => {
//     const dateKey = `${key}_date`;
//     const storedDate = localStorage.getItem(dateKey);

//     console.log(`📦 Kontroluji "${key}" → datum uložené: ${storedDate}`);

//     if (storedDate !== today && currentHour >= 13) {
//       console.warn(`🧹 Mazání "${key}" (není dnešek a je po 13:00)`);
//       localStorage.removeItem(key);
//       localStorage.setItem(dateKey, today);
//     } else {
//       console.log(`✅ "${key}" zůstává – ${storedDate === today ? "je dnešek" : "je před 13:00"}`);
//     }
//   });
// }


// test - doresit cas 
// const testMode = true; // ⬅️ nastav na false po otestování

// export function clearOldInteractions(keys = []) {
//   const now = new Date();

//   if (testMode) {
//     // 🧪 Simuluj čas (např. 14:00)
//     now.setHours(14);
//     now.setMinutes(0);
//     now.setSeconds(0);
//     console.warn("🧪 TEST MODE: Simuluji čas", now.toLocaleTimeString());
//   }

//   const today = now.toISOString().slice(0, 10);
//   const currentHour = now.getHours();

//   console.log(`🕓 Teď je ${now.toLocaleTimeString()} | Dnes: ${today}`);

//   keys.forEach((key) => {
//     const dateKey = `${key}_date`;
//     const storedDate = localStorage.getItem(dateKey);

//     console.log(`📦 Kontroluji "${key}" → datum uložené: ${storedDate}`);

//     if (storedDate !== today && currentHour >= 14) {
//       console.warn(`🧹 Mazání "${key}" (není dnešek a je po 14:00)`);
//       localStorage.removeItem(key);
//       localStorage.setItem(dateKey, today);
//     } else {
//       console.log(`✅ "${key}" zůstává – ${storedDate === today ? "je dnešek" : "je před 14:00"}`);
//     }
//   });
// }


  