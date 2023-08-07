import { ClientData } from "./client_data.type";

export type Payload = {
  sessionId?: string;

  message?: string;
  color?: string;
  /** The author of the message */
  author?: string;

  /** List of other players */
  peers?: Array<ClientData>;
  /** The player who goes first */
  first?: string;
  /** If the player is the spy */
  spy?: boolean;
  /** The current location */
  location?: string;
  /** List of all locations */
  locations?: string[];
};
