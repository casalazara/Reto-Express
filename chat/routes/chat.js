var express = require("express");
var router = express.Router();
var messagePersistence = require("../public/persistence/messagePersistence");
const ws = require("../wslib");

/* GET messages listing. */
router.get("/api/messages", function (req, res, next) {
  return res.send(messagePersistence.getMessages());
});

/* GET message with especific ts. */
router.get("/api/messages/:ts", (req, res) => {
  let msg = messagePersistence.getMessage(req.params.ts);
  if (!msg)
    return res.status(404).send("El mensaje con el ts consultado no existe.");
  return res.send(msg);
});

/* POST a chat message. */
router.post("/api/messages", (req, res) => {
  let valido = messagePersistence.validateMessage(req.body);
  if (valido != "OK") {
    return res.status(400).send("El formato no es válido. " + valido);
  }
  const msg = {
    author: req.body.author,
    message: req.body.message,
  };
  messagePersistence.postMessage(msg);
  ws.sendMessages();
  return res.send(msg);
});

/* PUT a chat message with especific ts. */
router.put("/api/messages", (req, res) => {
  if (messagePersistence.getMessage(req.body.ts)) {
    let valido = messagePersistence.validateMessage(req.body);

    if (valido != "OK") {
      return res.status(400).send("El formato no es válido. " + valido);
    }
    req.body.message += " (EDITED)";
    messagePersistence.putMessage(req.body);
    ws.sendMessages();
    return res.send(req.body);
  }
  return res.status(404).send("El mensaje con el ts a actualizar no existe.");
});

/* DELETE a chat message with especific ts. */
router.delete("/api/messages/:ts", (req, res) => {
  if (messagePersistence.getMessage(req.params.ts)) {
    let msg = messagePersistence.deleteMessage(req.params.ts);
    ws.sendMessages();
    return res.send(msg);
  }
  return res.status(404).send("El mensaje con el ts a eliminar no existe.");
});

module.exports = router;
