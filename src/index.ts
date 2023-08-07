import { Session } from "./session";
import { Client } from "./client";
import { startGame } from "./spy";
import { Socket } from "socket.io";
import { EventTypes } from "./types/event_types";
import { Payload } from "./types/payload.type";

const http = require("http").createServer();

const corsOptions = {
  cors: {
    origin: [
      "https://spy.verybadfrags.com",
      "https://heuristic-bartik-850df8.netlify.app",
    ],
    methods: ["GET", "POST"],
  },
};

const nodeEnv = process.env.NODE_ENV;
console.log(`NODE_ENV=${nodeEnv}`);

const localFrontEnd = "http://localhost:3000";
if (nodeEnv === "dev") {
  console.log(`Allowing cors for ${localFrontEnd}`);
  corsOptions.cors.origin.push(localFrontEnd);
}

// socket.io
const io = require("socket.io")(http, corsOptions);
const sessions = new Map();

function createId(len = 8, chars = "ABCDEFGHJKMNPQRSTWXYZ23456789") {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[(Math.random() * chars.length) | 0];
  }
  return id;
}

function createClient(socket: Socket) {
  return new Client(socket);
}

function createSession(id = createId(5)): Session {
  while (sessions.has(id)) {
    console.error(`Session ${id} already exists`);
    id = createId(6); // TODO standardize session length
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

  socket.on(EventTypes.ClientJoinSession, (data) => {
    if (session) {
      leaveSession(session, client);
    }
    if (data.sessionId) {
      session = getSession(data.sessionId) || createSession(data.sessionId);
    } else {
      session = createSession();
    }
    // TODO event SessionCreated is sent twice?
    client.send(EventTypes.SessionCreated, { sessionId: session.id });
    if (session) {
      console.log("Created session:", session.id);
      client.data.name = data.playerName;
      if (session.join(client)) {
        session.broadcastPeers();
      } else {
        socket.disconnect();
      }
    }
  });

  socket.on(EventTypes.ChatEvent, (data: Payload) => {
    if (!session) {
      socket.disconnect();
    } else {
      // TODO only broadcast to other clients
      session.broadcast(EventTypes.ChatEvent, {
        // id: client.id,
        author: client.data.name,
        message: data.message,
      });
    }
  });

  socket.on(EventTypes.ClientReady, (data: any) => {
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
        (acc, cli: Client) => acc && cli.data.ready,
        true
      );
      if (allReady) {
        startGame(session, false);
      } else {
        client.send(EventTypes.ChatEvent, {
          message: "All players must be ready",
          color: "red",
        });
      }
    }
  });

  socket.on("disconnect", () => {
    leaveSession(session, client);
  });
});

function leaveSession(session: Session, client: Client) {
  if (session) {
    session.leave(client);
    if (session.clients.size === 0) {
      sessions.delete(session.id);
      console.log("Sessions remaining:", sessions.size);
    } else {
      session.broadcastPeers();
    }
  }
}

const defaultPort = 8081;
const actualPort = process.env.PORT || defaultPort;
http.listen(actualPort, () => {
  console.log(`Listening for requests on http://localhost:${actualPort}`);
});
