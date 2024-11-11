export type ChatPayload = {
  /** The message to send */
  message: string;
  /** The color of the message */
  color?: string;
  /** The author of the message */
  author?: string;
  /** If the author is the receiving player */
  isSelf?: boolean;
};
