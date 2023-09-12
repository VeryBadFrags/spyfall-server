import { Session } from "./session";
import { Client } from "./client";
import { startGame } from "./spy";
import { Server, Socket } from "socket.io";
import { EventTypes } from "./types/types";
import { createServer } from "http";
import { JoinSessionData } from "./types/join-session";

const http = createServer();

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
if (nodeEnv === "development") {
  console.log(`Allowing cors for ${localFrontEnd}`);
  corsOptions.cors.origin.push(localFrontEnd);
}

// socket.io
const io = new Server(http, corsOptions);
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
    console.error(`Session ${id} already exists`);
    id = createId(6); // TODO standardize session length
  }
  const session = new Session(id, io);
  sessions.set(id, session);
  return session;
}

/**
 *
 * @param {string} id
 * @returns {Session} The corresponding Session
 */
function getSession(id: string): Session {
  return sessions.get(id);
}

io.on(
  "connection",
  /**
   *
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

    socket.on(
      EventTypes.ChatEvent,
      /**
       * @param {Payload} data
       */
      (data) => {
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
      },
    );

    socket.on(
      EventTypes.ClientReady,
      /**
       *
       * @param {any} data
       * TODO do not use any
       */
      (data) => {
        if (!session) {
          socket.disconnect();
        } else {
          client.data.ready = data.ready;
          session.broadcastPeers();
        }
      },
    );

    socket.on(EventTypes.StartGame, () => {
      if (!session) {
        socket.disconnect();
      } else {
        const allReady = Array.from(session.clients).reduce(
          /**
           *
           * @param {boolean} acc
           * @param {Client} cli
           * @returns {boolean} true if all clients are ready
           */
          (acc, cli) => acc && cli.data.ready,
          true,
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
  },
);

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
