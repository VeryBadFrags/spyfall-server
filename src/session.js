import { Server } from "socket.io";
import { Client } from "./client.js";
import { EventTypes } from "./types/types.js";
import { Payload } from "./types/payload.js";

/**
 * @class
 * @public
 */
export class Session {
  id;
  /**
   * @type {Server}
   */
  io;
  /**
   * @type {Set<Client>}
   */
  clients;
  avatars;

  /**
   *
   * @param {string} id
   * @param {Server} io
   */
  constructor(id, io) {
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
  join(client) {
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

    client.send(EventTypes.SessionCreated, {
      sessionId: this.id,
    });
    return true;
  }

  /**
   *
   * @param {Client} client
   */
  leave(client) {
    this.clients.delete(client);
    this.avatars.push(client.data.avatar);
  }

  /**
   * @param {string} type
   * @param {Payload} data
   */
  broadcast(type, data) {
    this.io.to(this.id).emit(type, data);
  }

  broadcastPeers() {
    const clientsArray = Array.from(this.clients);
    const payload = {
      sessionId: this.id,
      peers: clientsArray.map((cli) => cli.data),
    };
    this.io.to(this.id).emit(EventTypes.SessionBroadcast, payload);
  }
}
