export enum EventTypes {
  // Server
  SessionBroadcast = "session-broadcast",
  SessionCreated = "session-created",
  
  // Client
  Disconnect = "disconnect",

  ClientJoinSession = "join-session",
  ClientReady = "player-ready",

  // Both
  ChatEvent = "chat-event",
  StartGame = "start-game",
}
