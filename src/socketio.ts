import { Server as HttpServer } from "node:http";
import { Server, ServerOptions } from "socket.io";
import process from "node:process";
import { logger } from "./logger.ts";

export function initSocketIO(server: HttpServer) {
  const corsOrigins = process.env.CORS_ALLOW?.split(",");
  logger.info("Allowing cors", { origins: corsOrigins });
  const serverOptions: Partial<ServerOptions> = {
    cors: {
      origin: corsOrigins,
      methods: ["GET", "POST"],
    },
  };

  return new Server(server, serverOptions);
}
