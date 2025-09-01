import { API } from "../utils/config.js";

console.log("{fetchStoryVotes.js} 📡 načten");

// ziskani postu hlasu pro dany den 
export async function fetchGetVoteStory(date) {
  try {
    const response = await fetch(`${API.storyVotesGet}/${date}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "X-Client-Tag": "HACK_EXTENSION",
      }
    })

    return await response.json()
  } catch (error) {
    console.error("❌ Chyba při získávání hlasů:", error);
    return { like: 0, dislike: 0 }
  }
}

// odesilani hlasu
export async function fetchPostVoteStory(date, option) {

  try {
    const response = await fetch(API.storyVotesPost, {
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
