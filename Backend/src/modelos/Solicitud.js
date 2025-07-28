const { DataTypes } = require("sequelize");
const db = require("../configuracion/basededatos");

const Solicitud = db.define(
  "Solicitud",
  {
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombreCliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombreEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lugar_entrega: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numero_viajes: {
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
    mensajeRespuesta: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "mensajeRespuesta",
    },
  },
  {
    tableName: "solicitudes",
    timestamps: false,
  }
);

module.exports = Solicitud;
