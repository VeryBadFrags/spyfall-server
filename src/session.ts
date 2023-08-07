import { Server } from "socket.io";
import { Client } from "./client";
import { EventTypes } from "./types/event_types";
import { Payload } from "./types/payload.type";

export class Session {
  id: string;
  io: Server;
  clients: Set<Client>;
  avatars: Array<string>;

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

  join(client: Client) {
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

  leave(client: Client): void {
    this.clients.delete(client);
    this.avatars.push(client.data.avatar);
  }

  broadcast(type: string, data: Payload) {
    this.io.to(this.id).emit(type, data);
  }

  broadcastPeers() {
    const clientsArray = Array.from(this.clients);
    const payload = {
      sessionId: this.id,
      peers: clientsArray.map((cli) => cli.data),
    } as Payload;
    this.io.to(this.id).emit(EventTypes.SessionBroadcast, payload);
  }
}
