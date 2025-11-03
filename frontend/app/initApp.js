import { createTopPanel } from "./components/topPanel.js";
import { createNasaSection } from "./components/nasaSection.js";
import { createHackMindset } from "./components/hackMindset.js";
import { createStoryOfTheDay } from "./components/storyOfTheDay.js";
import { createRetroMachine } from "./components/retroMachine.js";
import { createProfile } from "./components/profile.js";
import { createDigitalSignpost } from "./components/digitalSignpost.js";
import { debug } from "./utils/logger/logger.js";


export async function initPopup() {
    debug("{initApp.js} ✅ Běží hlavní obsah!");

    const body = document.body;

    const [
        topPanel,
        hackMindset,
        nasaSection,
        storyOfTheDay,
        retroMachine,
        profile,
        digitalSignpost
  ] = await Promise.all([
        createTopPanel(),
        createHackMindset(),
        createNasaSection(),
        createStoryOfTheDay(),
        createRetroMachine(),
        createProfile(),
        createDigitalSignpost(),
  ]);

  [topPanel, hackMindset, nasaSection, digitalSignpost, storyOfTheDay, retroMachine, profile]
    .filter(Boolean)
    .forEach((section) => body.appendChild(section));

  debug("{initApp.js} ✅ Všechny sekce byly přidány!");
}