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
        let msg = JSON.stringify(data);
        //console.log(`Sending message '${type}': ${msg}`);
        this.socket.emit(type, msg);
    }
}

module.exports = Client;
