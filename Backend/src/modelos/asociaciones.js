const Pedido = require("./Pedido");
const Vehiculo = require("./Vehiculo");

Pedido.belongsTo(Vehiculo, { foreignKey: "vehiculo_id", as: "vehiculo" });
Vehiculo.hasMany(Pedido, { foreignKey: "vehiculo_id", as: "pedidos" });