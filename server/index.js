const Session = require("./session");
const Client = require("./client");
const SpyGame = require("./spy");

const http = require("http").createServer();

// socket.io
const io = require("socket.io")(http, {
  cors: {
    origin: "https://distracted-villani-c928ee.netlify.app",
    methods: ["GET", "POST"],
  },
});
const sessions = new Map();

function createId(len = 8, chars = "ABCDEFGHJKMNPQRSTWXYZ23456789") {
  let id = "";
  for (let i = 0; i < len; i++) {
    id += chars[(Math.random() * chars.length) | 0];
  }
  return id;
}

function createClient(socket) {
  return new Client(socket);
}

function createSession(id = createId(5)) {
  if (sessions.has(id)) {
    console.error(`Session ${id} already exists`);
    return null;
  }
  let session = new Session(id, io);
  sessions.set(id, session);
  return session;
}

function getSession(id) {
  return sessions.get(id);
}

io.on("connection", (socket) => {
  const client = new createClient(socket);
  let session;

  socket.on("join-session", (data) => {
    if (data.sessionId) {
      session = getSession(data.sessionId) || createSession(data.sessionId);
    } else {
      session = createSession();
    }
    if (session) {
      console.log("Created session:", session.id);
      client.name = data.playerName;
      if (session.join(client)) {
        session.broadcastPeers();
      } else {
        socket.disconnect();
      }
    }
  });

  socket.on("chat-event", (data) => {
    if (!session) {
      socket.disconnect();
    } else {
      // TODO only broadcast to other clients
      session.broadcast("chat-event", {
        id: client.id,
        author: client.name,
        message: data.message,
      });
    }
  });

  socket.on("player-ready", (data) => {
    if (!session) {
      socket.disconnect();
    } else {
      client.ready = data.ready;
      session.broadcastPeers();
    }
  });

  socket.on("start-game", () => {
    if (!session) {
      socket.disconnect();
    } else {
      let allReady = Array.from(session.clients).reduce(
        (acc, cli) => acc && cli.ready,
        true
      );
      if (allReady) {
        SpyGame.startGame(session);
      } else {
        client.send("chat-event", {
          message: "All players must be ready",
          color: "red",
        });
      }
    }
  });

  socket.on("disconnect", () => {
    if (session) {
      session.leave(client);
      if (session.clients.size === 0) {
        sessions.delete(session.id);
        console.log("Sessions remaining:", sessions.size);
      } else {
        session.broadcastPeers();
      }
    }
  });
});

const defaultPort = 8081;
const actualPort = process.env.PORT || defaultPort;
http.listen(actualPort, () => {
  console.log(`Serving Online Spy on http://localhost:${actualPort}`);
});
