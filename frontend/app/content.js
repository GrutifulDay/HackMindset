// // NEFUNGUJE ??? nelze vlozit import 

// console.log("📦 content.js byl načten")

// // 📡 Simulace `fetchProfile()` funkce
// async function fetchProfile() {
//   console.log("{funkce fetchProfile} ✅ funguje")

//   try {
//     const response = await fetch("https://localhost:3000/api/profile", {
//       headers: {
//         Authorization: "Bearer HACK_EXTENSION"
//       }
//     }).then(r => r.json()).then(console.log).catch(console.error)
    

//     if (!response.ok) throw new Error("❌ Chyba při načítání dat")

//     const data = await response.json()
//     console.log("✅ Data načtena:", data)
//     return data
//   } catch (error) {
//     console.error("❌ fetchProfile error", error)
//     return null
//   }
// }

// // 🧱 Pomocná funkce místo `el()` z uiSnippets.js
// function el(tag, text = null, styles = {}, attributes = {}) {
//   const element = document.createElement(tag)
//   if (text) element.textContent = text
//   Object.assign(element.style, styles)
//   Object.entries(attributes).forEach(([key, value]) =>
//     element.setAttribute(key, value)
//   )
//   return element
// }

// // 🧩 Funkce pro vytvoření profilové sekce
// async function createProfile() {
//   console.log("{funkce createProfile} ✅ funguje")

//   const profileData = await fetchProfile()
//   if (!profileData) return el("div", "❌ Chyba při načítání profilu", { color: "red" })

//   const aside = el("aside", null, {
//     background: "#f9f9f9",
//     padding: "12px",
//     border: "1px solid #ccc"
//   })

//   const ul = el("ul", null, {
//     listStyle: "none",
//     padding: "0",
//     margin: "0"
//   })

//   const hint = el("h3", "Moje Insta Tipy:")

//   const instaTipsKeys = ["science_tech_ai", "nature_travel_wildlife", "space_learning"]

//   instaTipsKeys.forEach((key) => {
//     const tag = profileData[key]
//     if (!tag) return

//     const li = el("li", null, {
//       alignItems: "center",
//       marginBottom: "6px"
//     })

//     const span = el("span", tag)

//     const button = el("button", "📋", {
//       marginLeft: "8px",
//       cursor: "pointer",
//       border: "1px solid #aaa",
//       borderRadius: "4px",
//       background: "#f0f0f0"
//     }, {
//       title: "Kopírovat hashtag"
//     })

//     button.addEventListener("click", () => {
//       navigator.clipboard.writeText(tag)
//         .then(() => {
//           console.log(`✅ Zkopírováno: ${tag}`)
//           button.textContent = "✅"
//           setTimeout(() => button.textContent = "📋", 1000)
//         })
//         .catch(err => {
//           console.error("❌ Chyba při kopírování:", err)
//         })
//     })

//     li.append(span, button)
//     ul.appendChild(li)
//   })

//   aside.append(hint, ul)
//   return aside
// }

// // 🎯 Spuštění profilu a přidání do stránky
// createProfile().then((profileEl) => {
//   const panel = document.createElement("div")
//   panel.id = "my-popup-panel"
//   Object.assign(panel.style, {
//     position: "fixed",
//     top: "10px",
//     right: "50px",
//     width: "280px",
//     backgroundColor: "#ffffff",
//     color: "#333",
//     padding: "16px",
//     borderRadius: "16px",
//     boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
//     fontFamily: "Arial, sans-serif",
//     zIndex: "999999"
//   })

//   const heading = document.createElement("h2")
//   heading.textContent = "Tvůj profil"
//   panel.appendChild(heading)
//   panel.appendChild(profileEl)

//   document.body.appendChild(panel)
// })
