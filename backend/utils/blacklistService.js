
// kontrola zda uz je v db 
// export async function loadBlacklistFromDB() {
//     try {
//       const allBlocked = await BlacklistedIP.find()
//       allBlocked.forEach(entry => blacklistedIPs.add(entry.ip))
//       console.log(`✅ Načteno ${allBlocked.length} IP adres z DB do paměti`);
//     } catch (err) {
//       console.error("❌ Chyba při načítání blacklistu z DB:", err.message);
//     }
// }