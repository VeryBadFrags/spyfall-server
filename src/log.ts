import { ClientEvents } from "./types/clientEvents.ts";
import { ServerEvents } from "./types/serverEvents.ts";

type logPayload = {
  room: string;
  player?: string;
  /** The type of event */
  type: ServerEvents | ClientEvents;

  /** The chat message sent */
  msg?: string;
  /** The amount of active rooms */
  totalRooms?: number;
  /** The number of players in the room */
  playersCount?: number;
  /** How many games have been played (including the one starting) */
  gamesPlayed?: number;
};

export function logEvent(payload: logPayload) {
  console.log(payload);
}
