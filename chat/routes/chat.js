var express = require("express");
var router = express.Router();

var messageLogic = require("../public/logic/messageLogic");
const ws = require("../wslib");
const Message = require("../public/models/Message");

/* GET messages listing. */
router.get("/api/messages", function (req, res, next) {
  return Message.findAll().then((result) => {
    return res.send(result);
  });
});

/* GET message with especific ts. */
router.get("/api/messages/:ts", (req, res) => {
  return Message.findOne({
    where: {
      ts: req.params.ts,
    },
  }).then((message) => {
    if (message === null) {
      return res.status(404).send("El mensaje con el ts consultado no existe.");
    } else return res.send(message);
  });
});

/* POST a chat message. */
router.post("/api/messages", (req, res) => {
  let valido = messageLogic.validateMessage(req.body);
  if (valido != "OK") {
    return res.status(400).send("El formato no es válido. " + valido);
  }
  return Message.create({
    author: req.body.author,
    message: req.body.message,
    ts: new Date().getTime(),
  }).then((response) => {
    ws.sendMessages();
    res.send(response);
  });
});

/* PUT a chat message with especific ts. */
router.put("/api/messages", (req, res) => {
  return Message.findOne({
    where: {
      ts: req.body.ts,
    },
  }).then((message) => {
    if (message === null) {
      return res
        .status(404)
        .send("El mensaje con el ts a actualizar no existe.");
    } else {
      let valido = messageLogic.validateMessage(req.body);
      if (valido != "OK") {
        return res.status(400).send("El formato no es válido. " + valido);
      }
      req.body.message += " (EDITED, last ts:" + req.body.ts + ")";
      req.body.ts = new Date().getTime();
      message.update(req.body).then((updated) => {
        ws.sendMessages();
        return res.send(updated);
      });
    }
  });
});

/* DELETE a chat message with especific ts. */
router.delete("/api/messages/:ts", (req, res) => {
  return Message.findOne({
    where: {
      ts: req.params.ts,
    },
  }).then((message) => {
    if (message === null) {
      return res.status(404).send("El mensaje con el ts a eliminar no existe.");
    } else {
      Message.destroy({
        where: {
          ts: req.params.ts,
        },
      });
      ws.sendMessages();
      return res.send(message);
    }
  });
});

module.exports = router;
