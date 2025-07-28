const Solicitud = require("./Solicitud");
const Pedido = require("./Pedido");
const Vehiculo = require("./Vehiculo");
const Chofer = require("./Chofer");

// Solicitud tiene uno a Pedido
Solicitud.hasMany(Pedido, { as: "pedidos", foreignKey: "solicitud_id" });
Pedido.belongsTo(Solicitud, { as: "solicitud", foreignKey: "solicitud_id" });

// Pedido pertenece a Vehiculo
Pedido.belongsTo(Vehiculo, { as: "vehiculo", foreignKey: "vehiculo_id" });
Vehiculo.hasMany(Pedido, { as: "pedidos", foreignKey: "vehiculo_id" });

// Relación: Un chofer puede tener muchos vehículos (si aplica)
Chofer.hasMany(Vehiculo, { as: "vehiculos", foreignKey: "chofer_id" });
// Relación: Un vehículo pertenece a un chofer
Vehiculo.belongsTo(Chofer, { as: "chofer", foreignKey: "chofer_id" });