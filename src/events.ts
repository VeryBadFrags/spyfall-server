export enum ClientEvent {
  /** Default event from socket.io */
  Connect = "connect",
  /** Default event from socket.io */
  Disconnect = "disconnect",

  JoinSession = "join-session",
  ClientReady = "player-ready",
  StartGame = "start-game",
  ChatEvent = "chat-event",
}

export enum ServerEvent {
  SessionBroadcast = "session-broadcast",
  SessionCreated = "session-created",
  SessionDeleted = "session-deleted",
  Time = "time",

  ChatEvent = "chat-event",
  StartGame = "start-game",
}
