/**
 * @typedef {Object} Payload
 * @property {string} [sessionId] - The session ID.
 * @property {string} [message] - The message.
 * @property {string} [color] - The color.
 * @property {string} [author] - The author of the message.
 * @property {ClientData[]} [peers] - List of other players.
 * @property {string} [first] - The player who goes first.
 * @property {boolean} [spy] - If the player is the spy.
 * @property {string} [location] - The current location.
 * @property {string[]} [locations] - List of all locations.
 */

/**
 * @typedef {string} EventTypes
 **/
/**
 * @enum {EventTypes}
 */
export const EventTypes = {
  // Server
  SessionBroadcast: "session-broadcast",
  SessionCreated: "session-created",

  // Client
  Disconnect: "disconnect",

  ClientJoinSession: "join-session",
  ClientReady: "player-ready",

  // Both
  ChatEvent: "chat-event",
  StartGame: "start-game",
};
