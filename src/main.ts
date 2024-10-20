import { Session } from "./session.ts";
import { Client } from "./client.ts";
import { startGame } from "./spy.ts";
import { Server, ServerOptions, Socket } from "socket.io";
import { EventTypes } from "./types/eventTypes.ts";
import { JoinSessionData } from "./types/joinSession.type.ts";
import { ChatPayload } from "./types/chatPayload.type.ts";
import { LobbyStatusPayload } from "./types/lobbyStatusPayload.type.ts";
import { createServer } from "node:http";
import process from "node:process";

const http = createServer();

// socket.io

const corsOrigins = process.env.CORS_ALLOW?.split(",");
console.log(`[setup] Allowing cors for [${corsOrigins}]`);
const serverOptions: Partial<ServerOptions> = {
  cors: {
    origin: corsOrigins,
    methods: ["GET", "POST"],
  },
};

const io = new Server(http, serverOptions);
const sessions = new Map();

/**
 * @param {number} len The length of the ID
 * @param {string} chars the characters to use
 * @returns {string} The generated ID
 */
function createId(
  len: number = 8,
  chars: string = "ABCDEFGHJKMNPQRSTWXYZ23456789",
): string {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[(Math.random() * chars.length) | 0];
  }
  return id;
}

function createClient(socket: Socket): Client {
  return new Client(socket);
}

function createSession(id = createId(5)): Session {
  while (sessions.has(id)) {
    console.error(`[error] Session ${id} already exists`);
    id = createId(6); // TODO standardize session length
  }
  const session = new Session(id, io);
  sessions.set(id, session);
  return session;
}

/**
 * @param {string} id
 * @returns {Session} The corresponding Session
 */
function getSession(id: string): Session {
  return sessions.get(id);
}

io.on(
  "connection",
  /**
   * @param {Socket} socket
   */
  (socket: Socket) => {
    const client = createClient(socket);
    let session: Session;

    socket.on(EventTypes.ClientJoinSession, (data: JoinSessionData) => {
      if (session) {
        leaveSession(session, client);
      }
      if (data.sessionId) {
        session = getSession(data.sessionId) || createSession(data.sessionId);
      } else {
        session = createSession();
      }
      // TODO event SessionCreated is sent twice?
      client.sendSessionInfo(EventTypes.SessionCreated, {
        sessionId: session.id,
      } as LobbyStatusPayload);
      if (session) {
        client.data.name = data.playerName;
        console.log(
          `type=${EventTypes.ClientJoinSession} session=${session.id} client=${client.data.name} total-sessions=${sessions.size}`,
        );
        if (session.join(client)) {
          session.broadcastPeers();
        } else {
          socket.disconnect();
        }
      }
    });

    socket.on(EventTypes.ChatEvent, (data: ChatPayload) => {
      if (!session) {
        socket.disconnect();
      } else {
        console.log(
          `type=${EventTypes.ChatEvent} session=${session.id} client="${client.data.name}" msg="${data.message}"`,
        );
        session.broadcastChat(EventTypes.ChatEvent, {
          author: client.data.name,
          message: data.message,
        });
      }
    });

    socket.on(EventTypes.ClientReady, (data) => {
      if (!session) {
        socket.disconnect();
      } else {
        client.data.ready = data.ready;
        session.broadcastPeers();
      }
    });

    socket.on(EventTypes.StartGame, () => {
      if (!session) {
        socket.disconnect();
      } else {
        const allReady = Array.from(session.clients).reduce(
          (acc: boolean, cli: Client): boolean => acc && cli.data.ready,
          true,
        );
        if (allReady) {
          startGame(session, false);
        } else {
          client.sendChat({
            message: "All players must be ready",
            color: "red",
          });
        }
      }
    });

    socket.on("disconnect", () => {
      leaveSession(session, client);
    });
  },
);

function leaveSession(session: Session, client: Client) {
  if (session) {
    session.leave(client);
    if (session.clients.size === 0) {
      sessions.delete(session.id);
      console.log(
        `type=session-deleted session=${session.id} total-sessions=${sessions.size}`,
      );
    } else {
      session.broadcastPeers();
    }
  }
}

const defaultPort = 8081;
const actualPort = process.env.PORT || defaultPort;
http.listen(actualPort, () => {
  console.log(
    `[setup] Listening for requests on http://localhost:${actualPort}`,
  );
});
