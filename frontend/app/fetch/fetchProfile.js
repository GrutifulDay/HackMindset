console.log("{fetchProfile.js} 📡 je načtený")

export async function fetchProfile() {
  console.log("{funkce fetchProfile} ✅ funguje");

  try {
    const response = await fetch("https://localhost:3000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-extension-auth": "HECK_EXTENSION"
      }
    })

    if (!response.ok) throw new Error("❌ Chyba při načítání dat")

    const data = await response.json()
    return data
  } catch (error) {
    console.error("❌ fetchProfile error", error);
    return null
  }
}
