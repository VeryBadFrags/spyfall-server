class Session {
    constructor(id, io) {
        this.id = id;
        this.io = io;
        this.clients = new Set;
        this.avatars = ['🐱', '🐶', '🦊', '🐭', '🐼', '🐧', '🐰', '🐯',
            '🦖', '🦉', '🐻', '🐠', '🦩', '🐢', '🐬', '🦆'];
    }

    join(client) {
        if (this.clients.has(client)) {
            console.log('Error: Client already in session');
            return false;
        }

        if (this.avatars.length === 0) {
            console.error('The game is full');
            return false;
        }

        this.clients.add(client);
        // Join the socket.io room
        client.joinRoom(this.id);

        let avatar = this.avatars.shift();
        client.avatar = avatar;
        client.name = `${avatar} ${client.name}`;

        client.send('session-created', {
            sessionId: this.id
        });
        return true;
    }

    leave(client) {
        this.clients.delete(client);
        client.session = null;
        this.avatars.push(client.avatar);
    }

    broadcast(type, data) {
        data.type = type;
        this.io.to(this.id).send(data);
    }

    broadcastPeers() {
        let clientsArray = Array.from(this.clients);
        let payload = {
            type: 'session-broadcast',
            sessionId: this.id,
            peers: {
                clients: clientsArray.map(cli => {
                    return {
                        id: cli.id,
                        name: cli.name,
                        ready: cli.ready,
                    };
                })
            }
        };
        this.io.to(this.id).send(payload);
    }
}

module.exports = Session;
