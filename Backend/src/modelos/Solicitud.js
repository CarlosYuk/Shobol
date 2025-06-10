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
      allowNull: false, // 'pendiente', 'en_proceso', 'completada'
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "solicitudes",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Solicitud;
