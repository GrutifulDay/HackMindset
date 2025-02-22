import { createClient } from "./libs/supabase.js";

const SUPABASE_URL = "https://wjtpcbrakswvnffjdlvd.supabase.co";
const SUPABASE_KEY = "TVŮJ_PUBLIC_API_KEY"; // Použij správný API klíč!

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function fetchStory() {
    console.log("📡 Načítám příběh z databáze...");

    const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false }) // Nejnovější příběh první
        .limit(1)
        .single();

    if (error) {
        console.error("❌ Chyba při načítání příběhu:", error);
        return { title: "Žádný příběh", content: "Dnes není dostupný žádný příběh.", author: "Neznámý autor" };
    }

    console.log("✅ Příběh úspěšně načten:", data);
    return data;
}
