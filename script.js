const highGraveyardCards = [
    "Arid Mesa", "Imperial Seal", "Flooded Strand", "Wheel of Fortune", "Wheel of Misfortune"
];

const generalDeckList = [
    "Ancient Tomb", "Arcane Signet", "Badlands", "Beseech the Mirror", "Birgi, God of Storytelling",
    "Blood Crypt", "Bloodstained Mire", "Bolas's Citadel", "Borne Upon a Wind", "Brainstorm",
    "Cabal Ritual", "Chain of Vapor", "Chromatic Star", "Chrome Mox", "City of Brass", "City of Traitors",
    "Command Tower", "Culling the Weak", "Dark Ritual", "Daze", "Defense Grid", "Deflecting Swat",
    "Demonic Consultation", "Demonic Counsel", "Diabolic Intent", "Entomb", "Fierce Guardianship",
    "Final Fortune", "Flare of Duplication", "Flusterstorm", "Gamble", "Gemstone Caverns",
    "Gitaxian Probe", "Goblin Welder", "Grim Monolith", "Grim Tutor", "Grinding Station", "Jeska's Will",
    "Last Chance", "Lion's Eye Diamond", "Lotus Petal", "Mana Vault", "Marsh Flats", "Mental Misstep",
    "Mindbreak Trap", "Misty Rainforest", "Mnemonic Betrayal", "Mox Amber", "Mox Diamond", "Mox Opal",
    "Mystic Remora", "Mystical Tutor", "Necrodominance", "Necropotence", "Otawara, Soaring City",
    "Pact of Negation", "Paradise Mantle", "Phyrexian Tower", "Polluted Delta", "Praetor's Grasp", 
    "Pyroblast", "Ragavan, Nimble Pilferer", "Rhystic Study", "Rite of Flame", "Rograkh, Son of Rohgahh",
    "Scalding Tarn", "Simian Spirit Guide", "Snap", "Sol Ring", "Springleaf Drum", "Steam Vents", 
    "Tainted Pact", "Talisman of Creativity", "Talisman of Dominance", "Talisman of Indulgence", 
    "Thassa's Oracle", "Timetwister", "Undercity Sewers", "Underground Sea", "Valley Floodcaller",
    "Vampiric Tutor", "Verdant Catacombs", "Volcanic Island", "Warrior's Oath", "Watery Grave",
    "Windfall", "Wishclaw Talisman", "Wooded Foothills", "Ad Nauseam"
];

// Initial mana pool values
let manaPool = { blue: 0, black: 0, red: 0, colorless: 0 };

// Function to adjust mana
function adjustMana(color, amount) {
    manaPool[color] += amount;
    if (manaPool[color] < 0) manaPool[color] = 0;
    document.getElementById(color + "Mana").innerText = manaPool[color];
}

// Function to generate random mana
function generateRandomMana() {
    let redMana;
    const rand = Math.random();

    if (rand < 0.5) {
        redMana = 4;
    } else if (rand < 0.7) {
        redMana = 3;
    } else if (rand < 0.9) {
        redMana = 5;
    } else {
        redMana = 6;
    }

    let nonRedMana = { blue: 0, black: 0, colorless: 0 };
    const maxNonRed = Math.max(0, 2 - (redMana > 4 ? 1 : 0));
    const extraManaCount = Math.floor(Math.random() * (maxNonRed + 1));
    const possibleColors = ['blue', 'black', 'colorless'];
    const chosenColors = [];

    while (chosenColors.length < extraManaCount) {
        const randomIndex = Math.floor(Math.random() * possibleColors.length);
        const chosenColor = possibleColors[randomIndex];
        if (!chosenColors.includes(chosenColor)) {
            chosenColors.push(chosenColor);
        }
    }

    chosenColors.forEach(color => {
        nonRedMana[color] = 1;
    });

    manaPool.red = redMana;
    manaPool.blue = nonRedMana.blue;
    manaPool.black = nonRedMana.black;
    manaPool.colorless = nonRedMana.colorless;

    document.getElementById("blueMana").innerText = manaPool.blue;
    document.getElementById("blackMana").innerText = manaPool.black;
    document.getElementById("redMana").innerText = manaPool.red;
    document.getElementById("colorlessMana").innerText = manaPool.colorless;
}

// Function to generate random cards for each section (Hand, Graveyard, Exile, In Play)
function getRandomCards(deck, count) {
    const shuffled = deck.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Function to display cards in each section
async function displayCards(section, cards) {
    const container = document.getElementById(section);
    container.innerHTML = ''; // Clear previous cards

    for (const card of cards) {
        const cardData = await fetchCardData(card);
        
        if (cardData && cardData.image_uris && cardData.image_uris.normal) {
            const img = document.createElement('img');
            img.src = cardData.image_uris.normal; // Display the card image
            img.alt = cardData.name;
            img.style.width = '100px';
            container.appendChild(img);
        } else {
            console.error(`Card data for "${card}" not found.`);
        }
    }
}

// Function to fetch card data from Scryfall API
async function fetchCardData(cardName) {
    try {
        const response = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Error fetching card data: ${response.statusText} for card "${cardName}"`);
            return null;
        }
    } catch (error) {
        console.error(`Failed to fetch card data: ${error}`);
        return null;
    }
}

// Function to generate Yes/No fields
function generateYesNoFields() {
    // Have you already played a land for turn?
    const landPlayedChance = Math.random();
    document.getElementById("playedLand").innerText = landPlayedChance < 0.4 ? "Yes" : "No";

    // Do your creatures have summoning sickness?
    const summoningSicknessChance = Math.random();
    let creaturesSick = summoningSicknessChance < 0.7 ? "Yes" : "No";

    const cardsInPlay = document.getElementById('inPlay').innerText.trim();
    const goblinWelderPresent = cardsInPlay.includes("Goblin Welder");
    const rograkhPresent = cardsInPlay.includes("Rograkh, Son of Rohgahh");

    if (goblinWelderPresent && rograkhPresent) {
        creaturesSick = "No";
    } else if (goblinWelderPresent) {
        creaturesSick = "No";
    }

    document.getElementById("summoningSickness").innerText = creaturesSick;

    // Do you have Metalcraft?
    const metalcraftChance = Math.random();
    document.getElementById("metalcraft").innerText = metalcraftChance < 0.6 ? "Yes" : "No";
}

// Main function to generate the random setup
document.getElementById('generate').addEventListener('click', async function() {
    const filteredDeck = generalDeckList.filter(card => card !== "Jeska's Will");

    const handSize = Math.floor(Math.random() * 3) + 2; // Random number between 2 and 4
    const hand = getRandomCards(filteredDeck, handSize);
    const remainingDeck = filteredDeck.filter(card => !hand.includes(card));

    const graveyardSize = Math.floor(Math.random() * 3) + 3; // Random number between 3 and 5
    const graveyard = ["Jeska's Will", ...getRandomCards(remainingDeck.concat(highGraveyardCards), graveyardSize)];
    const remainingAfterGraveyard = remainingDeck.filter(card => !graveyard.includes(card));

    const exile = getRandomCards(remainingAfterGraveyard, 3);

    const cardsInPlay = ["Rograkh, Son of Rohgahh"]; // Rograkh always in play
    const chance = Math.random();
    if (chance < 0.15) {
        cardsInPlay.push("Goblin Welder");
    } else if (chance < 0.20) {
        cardsInPlay.push("Wishclaw Talisman");
    } else if (chance < 0.27) {
        cardsInPlay.push("Chromatic Star");
    } else if (chance < 0.32) {
        cardsInPlay.push("Valley Floodcaller");
    } else if (chance < 0.37) {
        cardsInPlay.push("Silas Renn, Seeker Adept");
    } else if (chance < 0.42) {
        cardsInPlay.push("Lion's Eye Diamond");
    }

    // Display all cards in respective sections
    await displayCards('hand', hand);
    await displayCards('graveyard', graveyard);
    await displayCards('exile', exile);
    await displayCards('inPlay', cardsInPlay);

    // Generate mana and Yes/No fields
    generateRandomMana();
    generateYesNoFields();
});