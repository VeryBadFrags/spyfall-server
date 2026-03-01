import { ClientEvent } from "./types/clientEvent.ts";
import { ServerEvent } from "./types/serverEvent.ts";

type LogLevel = "info" | "warn" | "error" | "debug";

function log(level: LogLevel, message: string, data?: Record<string, unknown>) {
  const entry: Record<string, unknown> = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...data,
  };
  const content = JSON.stringify(entry);
  switch (level) {
    case "error":
      console.error(content);
      break;
    case "warn":
      console.warn(content);
      break;
    case "debug":
      console.debug(content);
    default:
      console.log(content);
  }
}

export const logger = {
  info: (message: string, data?: Record<string, unknown>) =>
    log("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) =>
    log("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) =>
    log("error", message, data),
  debug: (message: string, data?: Record<string, unknown>) =>
    log("debug", message, data),
};

export enum LogField {
  Msg = "msg",
  TotalRooms = "totalRooms",
  PlayersCount = "playersCount",
  GamesPlayed = "gamesPlayed",
}

type logPayload = {
  room: string;
  player?: string;
  /** The type of event */
  type: ServerEvent | ClientEvent;
  data?: Partial<Record<LogField, string | number>>;
};

export function logEvent(payload: logPayload) {
  const { data, ...rest } = payload;
  logger.info("event", { ...rest, ...data } as Record<string, unknown>);
}
