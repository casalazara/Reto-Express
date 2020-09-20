const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../lib/sequelize");

class Message extends Model {}

Message.init(
  {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ts: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  { sequelize, modelName: "Message" }
);

Message.sync();

module.exports = Message;
