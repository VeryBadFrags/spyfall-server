const locations = [
  "✈️💺 Airport",
  "🏦💰 Bank",
  "🎰💵 Casino",
  "🎞🍿 Cinema",
  "🦸🦹 Cosplay Convention",
  "🛳🌊 Cruise Ship",
  "⚽️🏟 Football Stadium",
  "🌳🏕 Forest Camp",
  "🏪🛒 Grocery Store",
  "🏥🧑‍⚕️ Hospital",
  "🏨🛏 Hotel",
  "🌕🧑‍🚀 Moon Colony",
  "🏛🖼 Museum",
  "🏟🎸 Rock Concert",
  "🚄🛤 Train Station",
  "🏫🎓 University",
];

const extendedLocations = [
  "🏝🥥 Desert Island",
  "⛰🥾 Mountain Hike",
  "🏤📮 Post Office",
  "🍽👩‍🍳 Restaurant",
];

function startGame(session, extendedMode) {
  const clientsArray = Array.from(session.clients);
  const spyIndex = Math.floor(Math.random() * clientsArray.length);
  const firstQuestion =
    clientsArray[Math.floor(Math.random() * clientsArray.length)].name;

  const gameLocations = extendedMode
    ? [...locations, ...extendedLocations]
    : locations;
  const currentLocation =
    gameLocations[Math.floor(Math.random() * locations.length)];

  clientsArray.forEach((client, index) => {
    const isSpy = spyIndex === index;
    client.ready = false;
    client.send("start-game", {
      spy: isSpy,
      location: isSpy ? "?" : currentLocation,
      locations: gameLocations,
      first: firstQuestion,
    });
  });
  session.broadcastPeers();
}

module.exports = { startGame };
