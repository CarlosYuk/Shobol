const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Solicitud = sequelize.define(
  "Solicitud",
  {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_solicitud: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente",
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "solicitudes",
    timestamps: false,
  }
);

module.exports = Solicitud;
