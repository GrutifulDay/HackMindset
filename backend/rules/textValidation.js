// // soubor pripraveny na pripadny Form - ted neni potreba

// // import { z } from "zod";

// // podminky 
// const bannedWords = [
//     "<script>", "</script>", "select", "drop", "delete", "insert",
//     "$gt", "$ne", "$or", "1=1", "or 1=1", "shutdown", "exec", 
//     "eval", "alert"
// ]

// const bannedChars = [
//     "<", ">", "{", "}", "$", ";", "`"
// ]


// export const textValidation = z.string()
//     .min(1, { message: "Text je příliš krátký" })
//     .max(500, { message: "Text je příliš dlouhý" })
//     .refine((val) => {
//         const lowerVal = val.toLowerCase()
    
//         // kontrola zakazanych slov 
//         for (const word of bannedWords) {
//           if (lowerVal.includes(word)) {
//             return false;
//           }
//         }

//         // kontrola znaku
//     for (const char of bannedChars) {
//         if (val.includes(char)) {
//           return false
//         }
//       }
  
//       return true; // ✅ Pokud je vse ok 
// }, { message: "Text obsahuje zakázané slovo nebo znak" })

// // 
// export function validateInput(schema) {
//     return (req, res, next) => {
//       try {
//         schema.parse(req.body) // validace celeho requestu
//         next() // ✅ vse ok, pokracuj
//       } catch (error) {
//         console.error("❌ Chyba validace:", error.errors);
//         res.status(400).json({
//           error: "❌ Neplatný vstup",
//           details: error.errors.map(err => err.message) // vrati jen normal text
//         })
//       }
//     }
// }

// // routes - priklad pro story-of-the-day, kdyz by mel form 
// import express from "express";
// import { textValidation } from "../validation/textValidation.js";
// import { validateInput } from "../middlewares/validateInput.js";
// import { saveStoryOfTheDay } from "../controllers/storyController.js";

// const router = express.Router()

// router.post("/story-of-the-day", validateInput(textValidation), saveStoryOfTheDay)

// export default router;

// // controllers 
// export async function saveStoryOfTheDay(req, res) {
//     // validace jako prvni, tady vse ok 
//     const { text } = req.body;
  
//     // ukladani do db 
//     console.log("✅ Příběh uložen:", text);
  
//     res.status(200).json({ message: "✅ Příběh uložen." })
// }


