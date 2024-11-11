import { Server } from "socket.io";
import { Player } from "./player.ts";
import { EventTypes } from "./types/eventTypes.ts";
import { ChatPayload } from "./types/chatPayload.type.ts";
import { LobbyStatusPayload } from "./types/lobbyStatusPayload.type.ts";
import { logEvent } from "./log.ts";
import { roundDurationSeconds } from "./constants.ts";
import { TimePayload } from "./types/timePayload.type.ts";
import { getTimeInSeconds } from "./utils.ts";

/**
 * @class
 * @public
 */
export class Session {
  /** The ID of the socket.io room */
  id;
  io: Server;
  players: Set<Player>;
  avatars;
  /** How many games have been started in this room */
  gamesPlayed = 0;
  /** The EPOCH time the round started */
  roundStartTime = 0;

  constructor(id: string, io: Server) {
    this.id = id;
    this.io = io;
    this.players = new Set();
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
   * @param {Player} client
   * @returns {boolean} true if the client was able to join
   */
  join(client: Player): boolean {
    if (this.players.has(client)) {
      console.error("[error] Client already in session");
      return false;
    }

    if (this.avatars.length === 0) {
      console.error("[error] The game is full");
      return false;
    }

    this.players.add(client);
    // Join the socket.io room
    client.joinRoom(this.id);

    const avatar = this.avatars.shift();
    client.data.avatar = avatar ? avatar : "?";
    client.data.name = `${avatar} ${client.data.name}`; // TODO keep name and avatar separate

    client.sendSessionInfo(EventTypes.SessionCreated, {
      sessionId: this.id,
      identity: avatar,
    } as LobbyStatusPayload);
    return true;
  }

  removeClient(client: Player): void {
    this.players.delete(client);
    this.avatars.push(client.data.avatar);
    this.broadcastPeers();
    logEvent({
      room: this.id,
      player: client.data.name,
      type: EventTypes.Disconnect,
      playersCount: this.players.size,
    });
    this.broadcastChat({
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
      playersCount: this.players.size,
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
   * Send a message to all players in the room.
   */
  broadcastChat(chat: ChatPayload): void {
    this.io.to(this.id).emit(EventTypes.ChatEvent, chat);
    this.broadcastTime();
  }

  broadcastPeers(): void {
    const clientsArray = Array.from(this.players);
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
