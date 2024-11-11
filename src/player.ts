import type { Socket } from "socket.io";
import type { ClientData } from "./types/clientData.type.ts";
import { EventTypes } from "./types/eventTypes.ts";
import type { ChatPayload } from "./types/chatPayload.type.ts";
import type { GamePayload } from "./types/gamePayload.type.ts";
import type { LobbyStatusPayload } from "./types/lobbyStatusPayload.type.ts";

/**
 * @class
 * @public
 */
export class Player {
  /** The socket.io client socket */
  socket: Socket;
  data: ClientData;

  /**
   * @param {Socket} socket The socket.io client socket
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
