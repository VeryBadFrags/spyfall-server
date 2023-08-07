import { Socket } from "socket.io";
import { Payload } from "./payload";

export class Client {
  socket: Socket;
  avatar: string;
  name: string;
  ready: boolean;

  constructor(socket: Socket) {
    this.socket = socket;
    this.avatar = "";
    this.name = "New player";
    this.ready = false;
  }

  joinRoom(id: string) {
    this.socket.join(id);
  }

  send(type: string, data: Payload) {
    this.socket.emit(type, data);
  }
}
