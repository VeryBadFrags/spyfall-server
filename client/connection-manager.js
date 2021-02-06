class ConnectionManager {
    constructor(messageCallback) {
        this.socket = null;
        this.eventCallback = messageCallback;
    }

    connect(playerName, sessionId, connectionEstablishedCallback, connectionClosedCallback) {
        this.socket = io();

        this.initSession(playerName, sessionId);
        connectionEstablishedCallback();

        this.socket.on('disconnect', () => {
            console.log('Connection closed');
            connectionClosedCallback();
        });

        this.socket.on('event', msg => {
            let data = JSON.parse(msg);
            this.eventCallback(data.type, data);
        });
    }

    disconnect() {
        this.socket.disconnect();
    }

    initSession(playerName, sessionId) {
        if (sessionId) {
            this.send('join-session', {
                sessionId: sessionId,
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
