export function createVotingReportUsers(text) {
    const message = document.createElement("div")
    message.className = "vote-thanks"
    message.textContent = text
  
    document.body.appendChild(message)
  
    setTimeout(() => {
      message.remove()
    }, 2500)
}

export function createFeedbackUntruth(text) {
  const message = document.createElement("div")
  message.className = "untruth-thanks"
  message.textContent = text

  document.body.appendChild(message)

  setTimeout(() => {
    message.remove()
  }, 2500)
}
  
  