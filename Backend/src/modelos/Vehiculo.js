const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Vehiculo = sequelize.define(
  "Vehiculo",
  {
    placa: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_chofer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nombre_propietario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "disponible",
    },
  },
  {
    tableName: "vehiculos",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Vehiculo;
