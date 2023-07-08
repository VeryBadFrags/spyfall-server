import { Server } from "socket.io";

export class Session {
  id: string;
  io: Server;
  clients: Set<any>;
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

  join(client: any) {
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
    client.avatar = avatar;
    client.name = `${avatar} ${client.name}`;

    client.send("message", {
      type: "session-created",
      sessionId: this.id,
    });
    return true;
  }

  leave(client) {
    this.clients.delete(client);
    this.avatars.push(client.avatar);
  }

  broadcast(type: string, data: any) {
    data.type = type;
    this.io.to(this.id).emit("message", data);
  }

  broadcastPeers() {
    const clientsArray = Array.from(this.clients);
    const payload = {
      type: "session-broadcast",
      sessionId: this.id,
      peers: clientsArray.map((cli) => {
        return {
          id: cli.id,
          name: cli.name,
          ready: cli.ready,
        };
      }),
    } as any;
    this.io.to(this.id).emit("message", payload);
  }
}
