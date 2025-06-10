const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Carga = sequelize.define(
  "Carga",
  {
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    peso_kg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    volumen_m3: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName: "cargas",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Carga;
