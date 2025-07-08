const Solicitud = require("./Solicitud");
const Pedido = require("./Pedido");
const Vehiculo = require("./Vehiculo");

// Solicitud tiene uno a Pedido
Solicitud.hasOne(Pedido, { as: "pedido", foreignKey: "solicitud_id" });
Pedido.belongsTo(Solicitud, { as: "solicitud", foreignKey: "solicitud_id" });

// Pedido pertenece a Vehiculo
Pedido.belongsTo(Vehiculo, { as: "vehiculo", foreignKey: "vehiculo_id" });
Vehiculo.hasMany(Pedido, { as: "pedidos", foreignKey: "vehiculo_id" });