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
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    volumen: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    tipo_carga: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    direccion_entrega: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_entrega: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "pendiente",
      allowNull: false,
    },
    vehiculo_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "pedidos",
    timestamps: false,
  }
);

module.exports = Pedido;
