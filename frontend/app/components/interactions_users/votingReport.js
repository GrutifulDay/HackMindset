
// zprava uzivateli po hlasovani img 
export function createVotingReportUsers(text) {
    const message = document.createElement("div")
    message.className = "vote-thanks"
    message.textContent = text
  
    document.body.appendChild(message)
  
    setTimeout(() => {
      message.remove()
    }, 2500)
}

// zprava uzivateli po oznaceni chyb  
export function createFeedbackUntruth(text) {
  const message = document.createElement("div")
  message.className = "untruth-thanks"
  message.textContent = text

  document.body.appendChild(message)

  setTimeout(() => {
    message.remove()
  }, 2500)
}
  
  