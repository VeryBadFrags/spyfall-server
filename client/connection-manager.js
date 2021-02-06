class ConnectionManager {
    constructor(messageCallback) {
        this.socket = null;
        this.peers = new Map();
        this.sessionId = null;
        this.messageCallback = messageCallback;
    }

    connect(playerName, sessionId, connectionEstablishedCallback, connectionClosedCallback) {
        this.socket = io();
        this.sessionId = sessionId;

        console.log('Connection established');
        this.initSession(playerName);
        connectionEstablishedCallback();

        this.socket.on('disconnect', () => {
            console.log('Connection closed');
            connectionClosedCallback();
        });

        this.socket.on('session-created', event => {
            let data = JSON.parse(event);
            this.sessionId = data.sessionId;
            this.messageCallback('session-created', data);
        });

        this.socket.on('session-broadcast', event => {
            let data = JSON.parse(event);
            this.messageCallback('session-broadcast', data);
        });

        this.socket.on('chat-event', event => {
            let data = JSON.parse(event);
            this.messageCallback('chat-event', data);
        });

        this.socket.on('start-game',event => {
            let data = JSON.parse(event);
            this.messageCallback('start-game', data);
        });
    }

    disconnect() {
        this.socket.disconnect();
    }

    initSession(playerName) {
        if (this.sessionId) {
            this.send('join-session', {
                sessionId: this.sessionId,
                playerName: playerName,
                game: 'spy',
            });
        } else {
            console.log('create-session');
            this.send('create-session', {
                playerName: playerName,
                game: 'spy',
            });
        }
    }

    send(type, data) {
        let msg = JSON.stringify(data);
        console.log(`Sending message ${type}: ${msg}`);
        this.socket.emit(type, msg);
    }
}
