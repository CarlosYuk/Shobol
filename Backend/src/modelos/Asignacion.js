const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Asignacion = sequelize.define(
  "Asignacion",
  {
    pedido_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ruta_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gestor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "asignaciones",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Asignacion;
