const { string } = require("joi");
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
      let x = messagePersistence.postMessage(message);
      if (x["details"]) {
        msg = "ERROR " + x.details[0].message;
        message = JSON.stringify(msg);
        ws.send(message);
      }
      sendMessages();
    });
  });
};

const sendMessages = () => {
  clients.forEach((client) => {
    messagePersistence.getMessages().then((result) => {
      var array = [];
      result.forEach((mensaje) => {
        array.push(mensaje.dataValues);
      });
      messages = JSON.stringify(array);
      client.send(messages);
    });
  });
};

exports.wsConnection = wsConnection;
exports.sendMessages = sendMessages;
