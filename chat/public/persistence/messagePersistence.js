const fs = require("fs");
const joi = require("joi");
const db = "./public/data/db.json";

function validateMessage(msg) {
  const schema = joi.object({
    author: joi
      .string()
      .pattern(/^[a-zA-Z]+\s[a-zA-Z]+$/)
      .required(),
    message: joi.string().min(5).required(),
    ts: joi.number(),
  });

  const validation = schema.validate(msg);
  if (validation.error) {
    return validation.error;
  }
  return "OK";
}

const getMessages = () => {
  return JSON.parse(fs.readFileSync(db, { encoding: "utf8", flag: "r" }));
};

function getMessage(timestamp) {
  let messages = getMessages();
  let msg = messages.find((aux) => aux.ts == timestamp);
  return msg;
}

function postMessage(message) {
  let messages = getMessages();
  message["ts"] = new Date().getTime();
  messages.push(message);
  persist(messages);
  return message;
}

function putMessage(message) {
  let messages = getMessages();
  let msg = messages.find((aux) => aux.ts == message.ts);
  msg.message = message.message;
  persist(messages);
  return msg;
}

function deleteMessage(timestamp) {
  let messages = getMessages();
  let msg = messages.find((aux) => aux.ts == timestamp);
  let i = messages.indexOf(msg);
  if (i != -1) {
    messages.splice(i, 1);
    persist(messages);
    return msg;
  }
  return null;
}

function persist(json) {
  fs.writeFileSync(db, JSON.stringify(json));
}

exports.validateMessage = validateMessage;
exports.getMessages = getMessages;
exports.getMessage = getMessage;
exports.postMessage = postMessage;
exports.putMessage = putMessage;
exports.deleteMessage = deleteMessage;
