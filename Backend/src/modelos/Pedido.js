const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Pedido = sequelize.define(
  "Pedido",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    solicitud_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    material: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cantidad_toneladas: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    direccion_entrega: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_entrega: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pendiente",
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    chofer_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "pedidos",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Pedido;
