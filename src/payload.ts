import { Client } from "./client";

export type Payload = {
  sessionId?: string;

  message?: string;
  color?: string;
  /** The author of the message */
  author?: string;

  /** List of other players */
  peers?: Array<Client>;
  /** The player who goes first */
  first?: string;
  /** If the player is the spy */
  spy?: boolean;
  /** The current location */
  location?: string;
  /** List of all locations */
  locations?: string[];
};

export enum EventTypes {
  // Outbound
  SessionBroadcast = "session-broadcast",
  SessionCreated = "session-created",
  StartGame = "start-game",
  // Inbound
  ClientJoinSession = "join-session",
  // Both
  ChatEvent = "chat-event",
}
