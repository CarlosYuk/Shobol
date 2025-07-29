const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Ubicacion = sequelize.define("Ubicacion", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  lat: { type: DataTypes.FLOAT, allowNull: false },
  lng: { type: DataTypes.FLOAT, allowNull: false },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: "ubicaciones",
  timestamps: false,
});

module.exports = Ubicacion;