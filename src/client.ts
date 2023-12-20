import { Socket } from "socket.io";
import { ClientData } from "./types/clientData.type";
import { EventTypes } from "./types/eventTypes";
import { ChatPayload } from "./types/chatPayload.type";
import { GamePayload } from "./types/gamePayload.type";
import { SessionStatusPayload } from "./types/sessionStatusPayload.type";

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

  sendSessionInfo(type: EventTypes, data: SessionStatusPayload) {
    this.socket.emit(type, data);
  }

  sendStartGame(data: GamePayload) {
    this.socket.emit(EventTypes.StartGame, data);
  }

  sendChat(data: ChatPayload) {
    this.socket.emit(EventTypes.ChatEvent, data);
  }
}
