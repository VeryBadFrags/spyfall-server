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
  let clientsArray = Array.from(session.clients);
  let spyIndex = Math.floor(Math.random() * clientsArray.length);
  let firstQuestion =
    clientsArray[Math.floor(Math.random() * clientsArray.length)].name;

  let gameLocations = extendedMode
    ? [...locations, ...extendedLocations]
    : locations;
  let currentLocation = gameLocations[Math.floor(Math.random() * locations.length)];

  clientsArray.forEach((client, index) => {
    let isSpy = spyIndex === index;
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
