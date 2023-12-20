import { Server } from "socket.io";
import { Client } from "./client";
import { EventTypes } from "./types/eventTypes";
import { ChatPayload } from "./types/chatPayload.type";
import { SessionStatusPayload } from "./types/sessionStatusPayload.type";

/**
 * @class
 * @public
 */
export class Session {
  id;
  io: Server;
  clients: Set<Client>;
  avatars;

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
   *
   * @param {Client} client
   * @returns {boolean} true if the client was able to join
   */
  join(client: Client): boolean {
    if (this.clients.has(client)) {
      console.log("Error: Client already in session");
      return false;
    }

    if (this.avatars.length === 0) {
      console.error("The game is full");
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
    } as SessionStatusPayload);
    return true;
  }

  leave(client: Client): void {
    this.clients.delete(client);
    this.avatars.push(client.data.avatar);
  }

  /**
   * Send a message to all session clients.
   * @param type
   * @param data
   */
  broadcastChat(type: EventTypes, data: ChatPayload): void {
    this.io.to(this.id).emit(type, data);
  }

  broadcastPeers(): void {
    const clientsArray = Array.from(this.clients);
    const payload = {
      sessionId: this.id,
      peers: clientsArray.map((cli) => cli.data),
    } as SessionStatusPayload;
    this.io.to(this.id).emit(EventTypes.SessionBroadcast, payload);
  }
}
