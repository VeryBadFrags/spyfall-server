class ConnectionManager {
    constructor(messageCallback) {
        this.conn = null;
        this.peers = new Map();
        this.sessionId = null;
        this.messageCallback = messageCallback;
        this.intervalId = null;
    }

    connect(address, playerName, sessionId, connectionEstablishedCallback, connectionClosedCallback) {
        this.conn = new WebSocket(address);
        this.sessionId = sessionId;

        this.conn.addEventListener('open', () => {
            console.log('Connection established');
            this.initSession(playerName);
            connectionEstablishedCallback();

            // Heartbeat
            this.intervalId = window.setInterval(function (conn) {
                conn.send(null);
            }, 30000, this.conn);
        });

        this.conn.addEventListener('close', () => {
            console.log('Connection closed');
            clearInterval(this.intervalId);
            connectionClosedCallback();
        });

        this.conn.addEventListener('message', event => {
            console.log('Received message', event.data);
            this.receive(event.data);
        });
    }

    initSession(playerName) {
        if (this.sessionId) {
            this.send({
                type: 'join-session',
                sessionId: this.sessionId,
                playerName: playerName,
                game: 'spy',
            });
        } else {
            this.send({
                type: 'create-session',
                playerName: playerName,
                game: 'spy',
            });
        }
    }

    send(data) {
        let msg = JSON.stringify(data);
        console.log(`Sending message ${msg}`);
        this.conn.send(msg);
    }
//TODO replace window.location.hash with ?code=
    receive(msg) {
        let data = JSON.parse(msg);
        if (data.type === 'session-created') {
            this.sessionId = data.sessionId;
            window.location.hash = data.sessionId;
        }
        this.messageCallback(data);
    }
}
