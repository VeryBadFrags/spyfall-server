import type { Socket } from "socket.io";
import type { ClientData } from "./types/clientData.type";
import { EventTypes } from "./types/eventTypes";
import type { ChatPayload } from "./types/chatPayload.type";
import type { GamePayload } from "./types/gamePayload.type";
import type { LobbyStatusPayload } from "./types/lobbyStatusPayload.type";

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

  sendSessionInfo(type: EventTypes, data: LobbyStatusPayload) {
    this.socket.emit(type, data);
  }

  sendStartGame(data: GamePayload) {
    this.socket.emit(EventTypes.StartGame, data);
  }

  /**
   * Send a chat event to the player
   * @param data
   */
  sendChat(data: ChatPayload) {
    this.socket.emit(EventTypes.ChatEvent, data);
  }
}
