// noinspection JSCheckFunctionSignatures

import { Socket } from "socket.io";
import { ClientData } from "./types/client_data.js";
import { Payload } from "./types/payload.js";

/**
 * @class
 * @public
 */
export class Client {
  /**
   * @type {Socket}
   */
  socket;
  /**
   * @type {ClientData}
   */
  data;

  /**
   *
   * @param {Socket} socket The socket.io Socket object
   */
  constructor(socket) {
    this.socket = socket;
    this.data = { avatar: "", name: "New Player", ready: false };
  }

  /**
   *
   * @param {string} id
   */
  joinRoom(id) {
    this.socket.join(id);
  }

  /**
   *
   * @param {string} type
   * @param {Payload} data
   */
  send(type, data) {
    this.socket.emit(type, data);
  }
}
