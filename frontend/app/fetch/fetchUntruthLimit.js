import { API } from "../utils/config.js";
import { getJwtToken } from "../utils/auth/jwtToken.js"

console.log("{fetchUntruthLimit.js} 📡 aktivní");

//odesila info, ze uzivatel oznacil vse jako nepravdu 
export async function fetchUntruthLimit(section, date) {
  const [day, month, year] = date.split("-")
  const formattedDate = `${year}-${month}`
  
  console.log("🧪 fetchUntruthLimit: section =", section, "date =", date);
  const token = await getJwtToken() 

  if (!token) {
    console.error("❌ Chybí JWT token – fetch se neprovede.");
    return null;
  }
  
  
  const response = await fetch(API.untruthLimitLog, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ section, date: formattedDate }) 
  })

  const data = await response.json()
  if (!response.ok) throw new Error(`Chyba serveru: ${JSON.stringify(data)}`)
  return data
}
