const WebSocketServer = require('ws').Server;

const Session = require('./session');
const Client = require('./client');
const SpyGame = require('./spy');

// Express static site
const http = require('http');
const express = require('express');

const app = express();
const staticServer = http.createServer(app);

const clientPath = `${__dirname}/../build`;
const staticPort = 8081;
app.use(express.static(clientPath));

staticServer.listen(staticPort, () => {
    console.log(`serving from ${clientPath} on http://localhost:${staticPort}`);
});

// WS
const server = new WebSocketServer({ port: 9001 });
const sessions = new Map;

function createId(len = 8, chars = 'ABCDEFGHJKMNPQRSTWXYZ23456789') {
    let id = '';
    for (let i = 0; i < len; i++) {
        id += chars[Math.random() * chars.length | 0];
    }
    return id;
}

function createClient(conn, id = createId()) {
    return new Client(conn, id);
}

function createSession(id = createId(4)) {
    if (sessions.has(id)) {
        throw new Error(`Session ${id} already exists`);
    }
    let session = new Session(id);
    sessions.set(id, session);
    return session;
}

function getSession(id) {
    return sessions.get(id);
}

server.on('connection', conn => {
    console.log('connection established');
    let client = new createClient(conn);

    conn.on('message', msg => {
        let data = JSON.parse(msg);

        if (data) {
            console.log('Message received', msg);
            if (data.type === 'create-session') {
                client.name = data.playerName;
                let session = createSession();
                if (session.join(client)) {
                    session.broadcastPeers();
                } else {
                    conn.close();
                }
            } else if (data.type === 'join-session') {
                let session = getSession(data.sessionId) || createSession(data.sessionId);
                client.name = data.playerName;
                if (session.join(client)) {
                    session.broadcastPeers();
                } else {
                    conn.close();
                }
            } else if (data.type === 'chat-event') {
                let session = getSession(data.sessionId);
                session.broadcast({
                    type: 'chat-event',
                    id: client.id,
                    author: client.name,
                    message: data.message
                });
            } else if (data.type === 'player-ready') {
                let session = getSession(data.sessionId);
                client.ready = data.ready;

                session.broadcastPeers();
            } else if (data.type === 'start-game') {
                let session = getSession(data.sessionId);
                let allReady = Array.from(session.clients).reduce((acc, cli) => acc && cli.ready, true);
                if (allReady) {
                    SpyGame.startGame(session);
                } else {
                    client.send({
                        type: 'chat-event',
                        message: 'All players must be ready',
                        color: 'red',
                    });
                }
            }
        }
    });

    conn.on('close', () => {
        let session = client.session;
        if (session) {
            session.leave(client);
            if (session.clients.size === 0) {
                sessions.delete(session.id);
                console.log('Sessions:', sessions);
            }
            session.broadcastPeers();
        }
    });
});
