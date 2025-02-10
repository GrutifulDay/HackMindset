const hashtags = [
    "#LearnToCode", "#SpaceDiscovery", "#HealthyMind", "#PsychologyFacts", "#DeepThinking",
    "#PositiveVibes", "#BookLover", "#ScienceEveryday", "#CreativeMinds", "#Mindfulness"
];

const randomHashtags = [];
for (let i = 0; i < 3; i++) {
    randomHashtags.push(hashtags[Math.floor(Math.random() * hashtags.length)]);
}

document.getElementById("hashtag1").innerText = randomHashtags[0];
document.getElementById("hashtag2").innerText = randomHashtags[1];
document.getElementById("hashtag3").innerText = randomHashtags[2];

document.getElementById("openHashtag").addEventListener("click", () => {
    const selectedHashtag = randomHashtags[Math.floor(Math.random() * randomHashtags.length)];
    const url = `https://www.instagram.com/explore/tags/${selectedHashtag.replace("#", "")}/`;
    chrome.tabs.create({ url });
});
