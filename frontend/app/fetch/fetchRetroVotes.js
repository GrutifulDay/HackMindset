import { API } from "../utils/config.js";

console.log("{fetchRetroVotes.js} 📡 načten");

// ziskani postu hlasu pro dany den 
export async function fetchGetVoteRetro(date) {
  try {
    const response = await fetch(`${API.retroVotesGet}/${date}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer HACK_EXTENSION"
      }
    })

    return await response.json()
  } catch (error) {
    console.error("❌ Chyba při získávání hlasů:", error);
    return { like: 0, dislike: 0 }
  }
}

// odesilani hlasu
export async function fetchPostVoteRetro(date, option) {

  try {
    const response = await fetch(API.retroVotesPost, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Tag": "HACK_EXTENSION"
      },
      body: JSON.stringify({ date, option })
    })

    return await response.json()
  } catch (error) {
    console.error("❌ Chyba při odesílání hlasu:", error);
    return null
  }
}
