import { Server } from "socket.io";
import { Client } from "./client.ts";
import { EventTypes } from "./types/eventTypes.ts";
import { ChatPayload } from "./types/chatPayload.type.ts";
import { LobbyStatusPayload } from "./types/lobbyStatusPayload.type.ts";
import { logEvent } from "./log.ts";
import { roundDurationSeconds } from "./constants.ts";
import { TimePayload } from "./types/timePayload.type.ts";
import { getTimeInSeconds } from "./utils/time.ts";

/**
 * @class
 * @public
 */
export class Session {
  id;
  io: Server;
  clients: Set<Client>;
  avatars;
  gamesPlayed = 0;
  roundStartTime = 0;

  constructor(id: string, io: Server) {
    this.id = id;
    this.io = io;
    this.clients = new Set();
    this.avatars = [
      "🐱",
      "🐶",
      "🦊",
      "🐭",
      "🐼",
      "🐧",
      "🐰",
      "🐯",
      "🦖",
      "🦉",
      "🐻",
      "🐠",
      "🦩",
      "🐢",
      "🐬",
      "🦆",
    ];
  }

  /**
   * @param {Client} client
   * @returns {boolean} true if the client was able to join
   */
  join(client: Client): boolean {
    if (this.clients.has(client)) {
      console.error("[error] Client already in session");
      return false;
    }

    if (this.avatars.length === 0) {
      console.error("[error] The game is full");
      return false;
    }

    this.clients.add(client);
    // Join the socket.io room
    client.joinRoom(this.id);

    const avatar = this.avatars.shift();
    client.data.avatar = avatar ? avatar : "?";
    client.data.name = `${avatar} ${client.data.name}`; // TODO keep name and avatar separate

    client.sendSessionInfo(EventTypes.SessionCreated, {
      sessionId: this.id,
    } as LobbyStatusPayload);
    return true;
  }

  removeClient(client: Client): void {
    this.clients.delete(client);
    this.avatars.push(client.data.avatar);
    this.broadcastPeers();
    logEvent({
      room: this.id,
      player: client.data.name,
      type: EventTypes.Disconnect,
      playersCount: this.clients.size,
    });
    this.broadcastChat(EventTypes.ChatEvent, {
      message: `${client.data.name} disconnected`,
    });
  }

  startGame() {
    this.broadcastPeers();
    this.gamesPlayed++;
    this.roundStartTime = getTimeInSeconds();
    logEvent({
      room: this.id,
      type: EventTypes.StartGame,
      playersCount: this.clients.size,
      gamesPlayed: this.gamesPlayed,
    });
    this.broadcastTime();
  }

  getTimeLeftSeconds() {
    const currentTime = getTimeInSeconds();
    const elapsed = currentTime - this.roundStartTime;
    return roundDurationSeconds - elapsed;
  }

  /**
   * Send a message to all session clients.
   * @param type
   * @param data
   */
  broadcastChat(type: EventTypes, data: ChatPayload): void {
    this.io.to(this.id).emit(type, data);
    this.broadcastTime();
  }

  broadcastPeers(): void {
    const clientsArray = Array.from(this.clients);
    const payload = {
      sessionId: this.id,
      peers: clientsArray.map((cli) => cli.data),
    } as LobbyStatusPayload;
    this.io.to(this.id).emit(EventTypes.SessionBroadcast, payload);
    this.broadcastTime();
  }

  broadcastTime(): void {
    const timeLeftSeconds = this.getTimeLeftSeconds();
    this.io.to(this.id).emit(EventTypes.Time, {
      durationSec: roundDurationSeconds,
      timeLeftSec: timeLeftSeconds,
    } as TimePayload);
  }
}
