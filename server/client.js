class Client {
    constructor(socket, id) {
        this.socket = socket;
        this.id = id;
        this.name = null;
        this.session = null;
        this.ready = false;
        this.avatar = null;
    }

    send(type, data) {
        data.type = type;
        let msg = JSON.stringify(data);
        //console.log(`Sending message '${type}': ${msg}`);
        this.socket.emit('event', msg);
    }
}

module.exports = Client;
