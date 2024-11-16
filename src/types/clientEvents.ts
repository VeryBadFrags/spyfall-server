export enum ClientEvents {
  ClientJoinSession = "join-session",
  ClientReady = "player-ready",
  StartGame = "start-game",

  ChatEvent = "chat-event",

  /** Default event from socket.io */
  Disconnect = "disconnect",
}
