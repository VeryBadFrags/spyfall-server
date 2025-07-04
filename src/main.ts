import { Session } from "./session";
import { Player } from "./player";
import { startGame } from "./spy";
import { Socket } from "socket.io";
import { ClientEvent } from "./types/clientEvent";
import { ServerEvent } from "./types/serverEvent";
import { JoinSessionData } from "./types/joinSession.type";
import { ChatPayload } from "./types/chatPayload.type";
import { LobbyStatusPayload } from "./types/lobbyStatusPayload.type";
import { createServer } from "node:http";
import process from "node:process";
import { initSocketIO } from "./socketio";
import { createId } from "./utils";
import { logEvent } from "./log";

const server = createServer();

const io = initSocketIO(server);
const sessions = new Map();

function createClient(socket: Socket): Player {
  return new Player(socket);
}

function createSession(id = createId(4)): Session {
  while (sessions.has(id)) {
    console.error(`[error] Session ${id} already exists`);
    id = createId();
  }
  const session = new Session(id, io);
  sessions.set(id, session);
  return session;
}

function getSession(id: string): Session {
  return sessions.get(id);
}

io.on("connection", (socket: Socket) => {
  const client = createClient(socket);
  let session: Session;

  socket.on(ClientEvent.JoinSession, (data: JoinSessionData) => {
    if (session) {
      leaveSession(session, client);
    }
    if (data.sessionId) {
      session = getSession(data.sessionId) || createSession(data.sessionId);
    } else {
      session = createSession();
    }
    // TODO event SessionCreated is sent twice?
    client.sendSessionInfo(ServerEvent.SessionCreated, {
      sessionId: session.id,
    } as LobbyStatusPayload);
    if (session) {
      client.data.name = data.playerName;
      logEvent({
        room: session.id,
        player: client.data.name,
        type: ClientEvent.JoinSession,
        totalRooms: sessions.size,
      });
      if (session.join(client)) {
        session.broadcastPeers();
      } else {
        socket.disconnect();
      }
    }
  });

  socket.on(ClientEvent.ChatEvent, (data: ChatPayload) => {
    if (!session) {
      socket.disconnect();
    } else {
      logEvent({
        room: session.id,
        player: client.data.name,
        type: ServerEvent.ChatEvent,
        msg: data.message,
      });
      session.broadcastChat({
        author: client.data,
        message: data.message,
      });
    }
  });

  socket.on(ClientEvent.ClientReady, (data) => {
    if (!session) {
      socket.disconnect();
    } else {
      client.data.ready = data.ready;
      session.broadcastPeers();
    }
  });

  socket.on(ClientEvent.StartGame, () => {
    if (!session) {
      socket.disconnect();
    } else {
      const allReady = Array.from(session.players).reduce(
        (acc: boolean, player: Player): boolean => acc && player.data.ready,
        true,
      );
      if (allReady) {
        const customLocations = new Set<string>(); // TODO add support for custom locations
        startGame(session, customLocations);
      } else {
        client.sendChat({
          message: "All players must be ready",
          color: "red",
        });
      }
    }
  });

  socket.on(ClientEvent.Disconnect, () => {
    leaveSession(session, client);
  });
});

function leaveSession(session: Session, client: Player) {
  if (session) {
    session.removeClient(client);
    if (session.players.size === 0) {
      sessions.delete(session.id);
      logEvent({
        room: session.id,
        type: ServerEvent.SessionDeleted,
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
