import { ClientData } from "./clientData.type";

export type LobbyStatusPayload = {
  sessionId: string;
  /** List of other players */
  peers?: Array<ClientData>;
};
