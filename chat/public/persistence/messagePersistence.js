var messageLogic = require("../logic/messageLogic");
const Message = require("../models/Message");

function postMessage(message) {
  let valido = messageLogic.validateMessage(message);
  if (valido != "OK") {
    return valido;
  }
  return Message.create({
    author: message.author,
    message: message.message,
    ts: new Date().getTime(),
  }).then((response) => {
    return response;
  });
}

function getMessages() {
  return Message.findAll().then((result) => {
    return result;
  });
}

exports.postMessage = postMessage;
exports.getMessages = getMessages;
