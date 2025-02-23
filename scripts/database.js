// import { createClient } from "./libs/supabase.js";

// const SUPABASE_URL = "https://wjtpcbrakswvnffjdlvd.supabase.co";
// const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndqdHBjYnJha3N3dm5mZmpkbHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAyNDUwMDMsImV4cCI6MjA1NTgyMTAwM30.sTdDO98v0tUOT0x17SjC7QqawND6vbXylCJKLryFzpY"; // Použij správný API klíč!

// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// export async function fetchStory() {
//     console.log("📡 Načítám příběh z databáze...");

//     const { data, error } = await supabase
//         .from("stories")
//         .select("*")
//         .order("created_at", { ascending: false }) // Nejnovější příběh první
//         .limit(1)
//         .single();

//     if (error) {
//         console.error("❌ Chyba při načítání příběhu:", error);
//         return { title: "Žádný příběh", content: "Dnes není dostupný žádný příběh.", author: "Neznámý autor" };
//     }

//     console.log("✅ Příběh úspěšně načten:", data);
//     return data;
// }
