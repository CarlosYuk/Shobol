require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const sequelize = require("./configuracion/basededatos");
const usuariosRoutes = require("./rutas/usuarios");
const authRutas = require("./rutas/auth");
const vehiculosRoutes = require("./rutas/vehiculos");
const rutasRoutes = require("./rutas/rutas");
const solicitudesRouter = require("./rutas/solicitudes");
//const cargasRoutes = require("./rutas/cargas");
const asignacionesRoutes = require("./rutas/asignaciones");
const reportesRoutes = require("./rutas/reportes");
const pedidosRoutes = require("./rutas/pedidos");
const choferRoutes = require("./rutas/chofer");
const ubicacionesRoutes = require("./rutas/ubicaciones");
const mensajesRoutes = require("./rutas/mensajes");
// Importar los modelos para que Sequelize los registre
require("./modelos/Usuario"); // Haz lo mismo con los otros modelos cuando los crees
require("./modelos/Vehiculo");
require("./modelos/Ruta");
require("./modelos/Solicitud");
require("./modelos/Pedido");
require("./modelos/asociaciones");
require("./modelos/Chofer"); // Importa el modelo Chofer
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRutas);
app.use("/api", usuariosRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api", rutasRoutes);
app.use("/api/solicitudes", solicitudesRouter);
//app.use("/api", cargasRoutes);
app.use("/api", asignacionesRoutes);
app.use("/api/reportes", require("./rutas/reportes"));
app.use("/api/pedidos", pedidosRoutes);
app.use("/api/choferes", choferRoutes);
app.use("/api/ubicaciones", ubicacionesRoutes);
app.use("/api/mensajes", mensajesRoutes);

const PUERTO = process.env.PUERTO || 3000;

// Sincroniza los modelos y arranca el servidor
sequelize
  .sync({ alter: true }) // Esto eliminará y recreará las tablas
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
    app.listen(5000, () => {
      console.log("Servidor corriendo en http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("Error sincronizando la base de datos:", error);
  });
