import { API } from "../utils/config.js";

export async function fetchUntruthLimit(section, date) {
  const [day, month, year] = date.split("-")
  const formattedDate = `${year}-${month}`
  const response = await fetch(API.untruthLimitLog, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer HACK_EXTENSION"
    },
    body: JSON.stringify({ section, date: formattedDate }) 
  })

  const data = await response.json()
  if (!response.ok) throw new Error(`Chyba serveru: ${JSON.stringify(data)}`)
  return data
}
