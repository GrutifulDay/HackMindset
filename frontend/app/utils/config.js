//const BASE_URL = "https://hackmindset.app/api"
const BASE_URL = "https://localhost:3000/api"

 export const DEV_MODE = true // true / false - pro produkci 


export const API = {
  nasa: `${BASE_URL}/nasa`,
  profile: `${BASE_URL}/profile`,
  retroMachine: `${BASE_URL}/retro-machine`,
  storyOfTheDay: `${BASE_URL}/story-of-the-day`,
  digitalSignpost: `${BASE_URL}/digitalSignpost`,
  retroVotesGet: `${BASE_URL}/retro-machine/retroVotesGet`,
  retroVotesPost: `${BASE_URL}/retro-machine/retroVotesPost`,
  storyVotesGet: `${BASE_URL}/story-of-the-day/storyVotesGet`,
  storyVotesPost: `${BASE_URL}/story-of-the-day/storyVotesPost`,
  untruthVotesPost: `${BASE_URL}/untruth-votes`,
  untruthLimitLog: `${BASE_URL}/untruth-limit-log`,
  getToken: `${BASE_URL}/get-token`
}


// chrome.storage.local.clear() // pro uplny vymaz 
// localStorage.clear()   

 // vymaz untruth hlasovani
// Object.keys(localStorage)    
//   .filter(key => key.startsWith("untruth-") || key.startsWith("abuse-limit-"))
//   .forEach(key => localStorage.removeItem(key))
