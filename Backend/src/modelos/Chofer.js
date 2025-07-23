const { DataTypes } = require("sequelize");
const sequelize = require("../configuracion/basededatos");

const Chofer = sequelize.define("choferes", {
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  empresa: { type: DataTypes.STRING },
  numero_unidad: { type: DataTypes.STRING },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false } // <-- obligatorio
}, {
  tableName: "choferes",
  timestamps: false
});

module.exports = Chofer;
