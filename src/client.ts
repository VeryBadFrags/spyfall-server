import { Socket } from "socket.io";

class Client {
  socket: Socket;
  avatar: string;
  name: string;
  ready: boolean;

  constructor(socket: Socket) {
    this.socket = socket;
    this.avatar = null;
    this.name = null;
    this.ready = false;
  }

  joinRoom(id: string) {
    this.socket.join(id);
  }

  send(type:string, data: any) {
    data.type = type;
    this.socket.send(data);
  }
}

module.exports = Client;
