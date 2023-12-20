// noinspection JSCheckFunctionSignatures

import { Socket } from "socket.io";
import { ClientData } from "./types/client_data";
import { Payload } from "./types/Payload";
import { EventTypes } from "./types/EventTypes";
import { ChatPayload } from "./types/ChatPayload";

/**
 * @class
 * @public
 */
export class Client {
  socket: Socket;
  data: ClientData;

  /**
   * @param {Socket} socket The socket.io Socket object
   */
  constructor(socket: Socket) {
    this.socket = socket;
    this.data = { avatar: "", name: "New Player", ready: false };
  }

  joinRoom(id: string) {
    this.socket.join(id);
  }

  send(type: EventTypes, data: Payload) {
    this.socket.emit(type, data);
  }

  // TODO consolidate with send
  sendChat(type: EventTypes, data: ChatPayload) {
    this.socket.emit(type, data);
  }
}
