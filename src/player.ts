import type { Socket } from "socket.io";
import type { ClientData } from "./types/clientData.type";
import { ServerEvent } from "./types/serverEvent";
import type { ChatPayload } from "./types/chatPayload.type";
import type { GamePayload } from "./types/gamePayload.type";
import type { LobbyStatusPayload } from "./types/lobbyStatusPayload.type";

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

  sendSessionInfo(type: ServerEvent, data: LobbyStatusPayload) {
    this.socket.emit(type, data);
  }

  sendStartGame(data: GamePayload) {
    this.socket.emit(ServerEvent.StartGame, data);
  }

  /**
   * Send a chat event to the player
   * @param data
   */
  sendChat(data: ChatPayload) {
    this.socket.emit(ServerEvent.ChatEvent, data);
  }
}
