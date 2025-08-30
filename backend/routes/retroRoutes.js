import express from "express"
import { validateApiKey } from "../middlewares/validateApiKey.js"
import { getRetroMachine } from "../controllers/retroControllers.js"
import { getRetroVotes, addRetroVote } from "../controllers/retroVotesController.js"
import { HACK_EXTENSION } from "../config.js"

const router = express.Router()

 
console.log("{storyRoutes.js} pripojeno");

router.get("/retro-machine", async (req, res) => {
    try {
      const doc = await Retro
        .findOne(/* tvoje podmínka – třeba dnešní záznam */)
        .select("title nostalgiggle date year -_id")   // ← jen whitelist polí
        .lean();
  
      if (!doc) return res.status(404).json({ error: "❌ Nenalezeno" });
      return res.status(200).json(doc);
    } catch (e) {
      return res.status(500).json({ error: "Server error" });
    }
  });

router.get(
    "/retro-machine/retroVotesGet/:date",
    validateApiKey(HACK_EXTENSION, "Zavolání GET /retroVotesGet"),
    getRetroVotes
)

router.post(
    "/retro-machine/retroVotesPost",
    validateApiKey(HACK_EXTENSION, "Zavolání POST /retroVotesPost"),
    addRetroVote
)

export default router

