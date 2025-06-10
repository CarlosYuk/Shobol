const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Ruta = sequelize.define(
  "Ruta",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    origen: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    destino: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    distancia_km: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
  },
  {
    tableName: "rutas",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Ruta;
