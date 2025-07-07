import { createTopPanel } from "./components/topPanel.js";
import { createNasaSection } from "./components/nasaSection.js";
import { createHackMindset } from "./components/hackMindset.js";
import { createStoryOfTheDay } from "./components/storyOfTheDay.js";
import { createRetroMachine } from "./components/retroMachine.js";
import { createProfile } from "./components/profile.js";
import { createDigitalSignpost } from "./components/digitalSignpost.js";


export async function initPopup() {
    console.log("{initApp.js} ✅ Běží hlavní obsah!");

    const body = document.body;


    const topPanel = await createTopPanel();
    const hackMindset = await createHackMindset();
    const nasaSection = await createNasaSection();
    const storyOfTheDay = await createStoryOfTheDay();
    const retroMachine = await createRetroMachine();
    const profile = await createProfile();
    const digitalSignpost = await createDigitalSignpost();

  [topPanel, hackMindset, nasaSection, digitalSignpost, storyOfTheDay, retroMachine, profile]
    .filter(Boolean)
    .forEach((section) => body.appendChild(section));

  console.log("{initApp.js} ✅ Všechny sekce byly přidány!");
}