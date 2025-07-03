const Pedido = require("./Pedido");
const Vehiculo = require("./Vehiculo");

// Aquí defines las asociaciones
Pedido.belongsTo(Vehiculo, { foreignKey: "vehiculo_id", as: "vehiculo" });
Vehiculo.hasMany(Pedido, { foreignKey: "vehiculo_id", as: "pedidos" });

module.exports = { Pedido, Vehiculo };