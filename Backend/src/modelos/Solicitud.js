const { DataTypes } = require("sequelize");
const db = require("../configuracion/basededatos"); // Asegúrate que este archivo existe y exporta la instancia de Sequelize

const Solicitud = db.define(
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
    motivoRechazo: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "motivoRechazo", // coincide con la BD
    },
    mensajeRespuesta: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "mensajeRespuesta",
    },
  },
  {
    tableName: "solicitudes",
    timestamps: false, // o true si usas createdAt/updatedAt
  }
);

module.exports = Solicitud;
