import { Session } from "./session.ts";
import { EventTypes } from "./types/eventTypes.ts";
import { GamePayload } from "./types/gamePayload.type.ts";

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

export function startGame(session: Session, extendedMode: boolean) {
  const clientsArray = Array.from(session.clients);
  const spyIndex = Math.floor(Math.random() * clientsArray.length);
  const firstQuestion =
    clientsArray[Math.floor(Math.random() * clientsArray.length)].data.name;

  const gameLocations = extendedMode
    ? [...locations, ...extendedLocations]
    : locations;
  const currentLocation =
    gameLocations[Math.floor(Math.random() * locations.length)];

  console.log(`type=${EventTypes.StartGame} session=${session.id}`);

  clientsArray.forEach((client, index) => {
    const isSpy = spyIndex === index;
    client.data.ready = false;
    client.sendStartGame({
      spy: isSpy,
      location: isSpy ? "?" : currentLocation,
      locations: gameLocations,
      first: firstQuestion,
    } as GamePayload);
  });
  session.broadcastPeers();
}
