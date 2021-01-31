class Session {
    constructor(id) {
        this.id = id;
        this.clients = new Set;
        console.log('Creating session', this);
        this.avatars = ['🐱', '🐶', '🦊', '🐭', '🐼', '🐧', '🐰', '🐯',
            '🦖', '🦉', '🐻', '🐠', '🦩', '🐢', '🐬', '🦆'];
    }
    join(client) {
        if (client.session) {
            console.log('Error: Client already in session');
            return false;
        }
        this.clients.add(client);
        client.session = this;

        if (this.avatars.length === 0) {
            console.log('The game is full');
            return false;
        }
        let avatar = this.avatars.shift();
        client.avatar = avatar;
        client.name = `${avatar} ${client.name}`;

        client.send({
            type: 'session-created',
            sessionId: this.id
        });
        return true;
    }
    leave(client) {
        if (client.session !== this) {
            throw new Error('Client not in session');
        }
        this.clients.delete(client);
        client.session = null;
        this.avatars.push(client.avatar);
    }
    
    broadcast(msg) {
        this.clients.forEach(client => client.send(msg));
    }

    broadcastPeers() {
        let clientsArray = Array.from(this.clients);
        clientsArray.forEach(client => client.send({
            type: 'session-broadcast',
            sessionId: this.id,
            peers: {
                you: client.id,
                clients: clientsArray.map(cli => {
                    return {
                        id: cli.id,
                        name: cli.name,
                        ready: cli.ready,
                    };
                })
            }
        }));
    }
}

module.exports = Session;
