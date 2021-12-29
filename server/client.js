class Client {
  constructor (socket) {
    this.socket = socket
    this.avatar = null
    this.name = null
    this.ready = false
  }

  joinRoom (id) {
    this.socket.join(id)
  }

  send (type, data) {
    data.type = type
    this.socket.send(data)
  }
}

module.exports = Client
