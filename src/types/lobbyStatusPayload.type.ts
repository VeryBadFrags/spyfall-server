import { ClientData } from "./clientData.type.ts";

export type LobbyStatusPayload = {
  sessionId: string;
  /** List of other players */
  peers?: Array<ClientData>;
};
