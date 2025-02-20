import { fetchNasaImage } from "./scripts/fetch";

document.addEventListener("DOMContentLoaded", async () => {
    console.log("✅ Popup.js běží správně!")

    const nasaData = await fetchNasaImage()

    console.log("📌 Načtený NASA obrázek pro popup:", nasaData)

    document.getElementById("nasaImage").src = nasaData.url
    document.getElementById("nasaDescription").textContent = nasaData.explanation

})
// let modal = document.createElement("div")
// modal.innerHTML = `
//     <div id="customAlert" class="modal">
//         <div id="modal-content">
//             <span class="close">&times;</span>
//             <button id="openContent">Heck Mindset</button>
//         </div>
//     </div>`
// document.body.appendChild(modal)

// // let section = document.createElement("div")
// // section.innerHTML = `
// //     <div class="section">
// //         <img id="nasaImage" src="" alt="Astronomy Picture of the Day">
// //         <p id="nasaDescription">Loading...</p>
// //         <a href="https://apod.nasa.gov/apod/astropix.html" target="_blank">Do you want more?</a>
// //     </div>`
// // document.body.appendChild(section)



// document.getElementsByClassName("close")[0].addListener("click", () => {
//     let openContent = document.getElementById("openContent")

//     document.getElementsByClassName("modal")[0].style.display = "none"
// })


// setTimeout(function () {
//     document.getElementsByClassName("modal")[0].style.display = "block"
// }, 1000) //300000 = 5min





