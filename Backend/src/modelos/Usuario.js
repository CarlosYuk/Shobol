const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Usuario = sequelize.define(
  "Usuario",
  {
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contrasena: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM("administrador", "gestor", "cliente"),
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

module.exports = Usuario;
