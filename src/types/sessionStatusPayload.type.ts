import { ClientData } from "./clientData.type";

export type SessionStatusPayload = {
  sessionId?: string;
  /** List of other players */
  peers?: Array<ClientData>;
};
