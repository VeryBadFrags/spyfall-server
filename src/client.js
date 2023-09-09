import { Socket } from "socket.io";
import "./types.js";

/**
 * @class
 * @constructor
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
   * @param {Socket} socket
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
