import { API } from "../../config.js"

console.log("{fetchRetroMachine.js} 📡 je načtený")

export async function fetchRetroMachine() {
  console.log("{funkce fetchRetroMachine} ✅ funguje");

  try {
    const response = await fetch(API.retroMachine, {
      mode: "cors",
      headers: {
        "Authorization": "Bearer HACK_EXTENSION"
      }
    })

    if (!response.ok) throw new Error("❌ Chyba při načítání dat")

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ fetchRetroMachine error", error);
    return null
  }
}
