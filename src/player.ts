import type { Socket } from "socket.io";
import { ServerEvent } from "./events.ts";

export type ClientData = {
  avatar: string;
  name: string;
  ready: boolean;
};

export type ChatPayload = {
  /** The message to send */
  message: string;
  /** The color of the message */
  color?: string;
  /** The author of the message */
  author?: ClientData;
};

export type LobbyStatusPayload = {
  /** The ID of the room */
  sessionId: string;
  /** The identity of the current player */
  identity?: string;
  /** List of other players */
  peers?: Array<ClientData>;
};

export type GamePayload = {
  /** The player who goes first */
  first: string;
  /** If the player is the spy */
  spy: boolean;
  /** The current location */
  location: string;
  /** List of all locations */
  locations: Array<string>;
};

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
