const WebSocket = require("ws");
const messagePersistence = require("./public/persistence/messagePersistence");
const clients = [];

const wsConnection = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);
    sendMessages();

    ws.on("message", (message) => {
      message = JSON.parse(message);
      messagePersistence.postMessage(message);
      sendMessages();
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => {
    messages = JSON.stringify(messagePersistence.getMessages());
    client.send(messages);
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
