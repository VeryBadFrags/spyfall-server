const locationsList = [
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

function startGame(session) {
  let location =
    locationsList[Math.floor(Math.random() * locationsList.length)];
  let clientsArray = Array.from(session.clients);
  let spyIndex = Math.floor(Math.random() * clientsArray.length);
  let firstQuestion =
    clientsArray[Math.floor(Math.random() * clientsArray.length)].name;
  clientsArray.forEach((client, index) => {
    let isSpy = spyIndex === index;
    client.ready = false;
    client.send("start-game", {
      spy: isSpy,
      location: isSpy ? "?" : location,
      locations: locationsList,
      first: firstQuestion,
    });
  });
  session.broadcastPeers();
}

module.exports = { startGame };
