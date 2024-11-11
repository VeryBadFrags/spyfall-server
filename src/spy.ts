import { Session } from "./session.ts";
import { GamePayload } from "./types/gamePayload.type.ts";

const locations = [
  "✈️💺 Airport",
  // "🎡🎢 Amusement Park",
  "🏦💰 Bank",
  "🎰💵 Casino",
  "🎞🍿 Cinema",
  // "🎪🤡 Circus Show",
  "🦸🦹 Cosplay Convention",
  "🛳🌊 Cruise Ship",
  "🏝🥥 Desert Island",
  "⚽️🏟 Football Stadium",
  "🌳🏕 Forest Camp",
  "🏪🛒 Grocery Store",
  "🏥🧑‍⚕️ Hospital",
  "🏨🛏 Hotel",
  // "⛸️🧊 Ice Rink",
  "🌕🧑‍🚀 Moon Colony",
  "⛰🥾 Mountain Hike",
  "🏛🖼 Museum",
  "🏤📮 Post Office",
  "🍽👩‍🍳 Restaurant",
  "🏟🎸 Rock Concert",
  "🚄🛤 Train Station",
  "🏫🎓 University",
];

export function startGame(session: Session, customLocations: Set<string>) {
  const clientsArray = Array.from(session.players);
  const spyIndex = Math.floor(Math.random() * clientsArray.length);
  const firstPlayer =
    clientsArray[Math.floor(Math.random() * clientsArray.length)].data.name;

  const gameLocations = [...locations, ...customLocations];
  const currentLocationIndex = Math.floor(Math.random() * locations.length);
  const currentLocation = gameLocations[currentLocationIndex];

  clientsArray.forEach((client, index) => {
    const isSpy = spyIndex === index;
    client.data.ready = false;
    client.sendStartGame({
      spy: isSpy,
      location: isSpy ? "?" : currentLocation,
      locations: gameLocations,
      first: firstPlayer,
    } as GamePayload);
  });
  session.startGame();
}
