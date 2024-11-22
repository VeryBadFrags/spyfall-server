/**
 * Create or join a Session
 */
export type JoinSessionPayload = {
  sessionId: string;
  playerName: string;
  game: string;

  moderator?: boolean;
};
