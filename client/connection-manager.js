export default class ConnectionManager {
  constructor(messageCallback) {
    this.socket = null;
    this.eventCallback = messageCallback;
  }

  connect(
    playerName,
    sessionId,
    connectionEstablishedCallback,
    connectionClosedCallback
  ) {
    this.socket = io();

    this.initSession(playerName, sessionId);
    connectionEstablishedCallback();

    this.socket.on("disconnect", () => {
      console.log("Connection closed");
      connectionClosedCallback();
    });

    this.socket.on("message", (msg) => {
      this.eventCallback(msg.type, msg);
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  initSession(playerName, sessionId) {
    this.send("join-session", {
      sessionId: sessionId,
      playerName: playerName,
      game: "spy",
    });
  }

  send(type, data) {
    this.socket.emit(type, data);
  }
}
