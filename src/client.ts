import { Socket } from "socket.io";
import { ClientData } from "./types/client_data.type";
import { Payload } from "./types/payload.type";

export class Client {
  socket: Socket;
  data: ClientData;

  constructor(socket: Socket) {
    this.socket = socket;
    this.data = {avatar: "", name: "New Player", ready: false}
  }

  joinRoom(id: string) {
    this.socket.join(id);
  }

  send(type: string, data: Payload) {
    this.socket.emit(type, data);
  }
}
