import { Session } from "./session.ts";
import { Client } from "./client.ts";
import { startGame } from "./spy.ts";
import { Socket } from "socket.io";
import { EventTypes } from "./types/eventTypes.ts";
import { JoinSessionData } from "./types/joinSession.type.ts";
import { ChatPayload } from "./types/chatPayload.type.ts";
import { LobbyStatusPayload } from "./types/lobbyStatusPayload.type.ts";
import { createServer } from "node:http";
import process from "node:process";
import { initSocketIO } from "./socketio.ts";
import { createId } from "./utils.ts";
import { logEvent } from "./log.ts";

const server = createServer();

const io = initSocketIO(server);
const sessions = new Map();

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

function getSession(id: string): Session {
  return sessions.get(id);
}

io.on(
  "connection",
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
        logEvent({
          room: session.id,
          player: client.data.name,
          type: EventTypes.ClientJoinSession,
          totalRooms: sessions.size,
        });
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
        logEvent({
          room: session.id,
          player: client.data.name,
          type: EventTypes.ChatEvent,
          msg: data.message,
        });
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
    session.removeClient(client);
    if (session.clients.size === 0) {
      sessions.delete(session.id);
      logEvent({
        room: session.id,
        type: EventTypes.SessionDeleted,
        totalRooms: sessions.size,
      });
    }
  }
}

const defaultPort = 8081;
const actualPort = process.env.PORT || defaultPort;
server.listen(actualPort, () => {
  console.log(
    `[setup] Listening for requests on http://localhost:${actualPort}`,
  );
});
