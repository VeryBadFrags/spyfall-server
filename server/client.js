class Client {
    constructor(conn, id) {
        this.conn = conn;
        this.id = id;
        this.name = null;
        this.session = null;
        this.ready = false;
        this.avatar = null;
    }

    send(data) {
        let msg = JSON.stringify(data);
        console.log(`Sending message ${msg}`);
        this.conn.send(msg, function ack(err) {
            if (err) {
                console.error('Failed to send message to client', msg, err);
            }
        })
    }
}

module.exports = Client;
