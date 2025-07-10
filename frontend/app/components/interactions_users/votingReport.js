
// zprava uzivateli po hlasovani 
export function createVotingReportUsers(text) {
    const message = document.createElement("div")
    message.className = "vote-thanks"
    message.textContent = text
  
    document.body.appendChild(message)
  
    setTimeout(() => {
      message.remove()
    }, 2500)
}

// pridat diky za odeslani chyb 

  
  