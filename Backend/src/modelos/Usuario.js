const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");
const bcrypt = require("bcrypt");

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
      type: DataTypes.ENUM("administrador", "gestor", "cliente", "chofer"), // agrega "chofer"
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
    tokenRecuperacion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tokenExpira: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "usuarios",
    timestamps: true,
    createdAt: "creado_en",
    updatedAt: false,
  }
);

Usuario.beforeCreate(async (usuario, options) => {
  if (usuario.contrasena) {
    const salt = await bcrypt.genSalt(10);
    usuario.contrasena = await bcrypt.hash(usuario.contrasena, salt);
  }
});

module.exports = Usuario;
