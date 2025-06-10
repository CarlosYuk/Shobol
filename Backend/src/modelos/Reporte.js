const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Reporte = sequelize.define(
  "Reporte",
  {
    tipo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_generado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    formato: {
      type: DataTypes.STRING,
      allowNull: false, // 'pdf', 'excel'
    },
  },
  {
    tableName: "reportes",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Reporte;
