const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Mensaje = sequelize.define("Mensaje", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  texto: { type: DataTypes.TEXT, allowNull: false },
  leido: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: "mensajes",
  timestamps: true,
});

module.exports = Mensaje;