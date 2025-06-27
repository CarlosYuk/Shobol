const Reporte = require("../modelos/Reporte");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const Usuario = require("../modelos/Usuario");
const Solicitud = require("../modelos/Solicitud");
const Vehiculo = require("../modelos/Vehiculo");
const Pedido = require("../modelos/Pedido");

// Listar reportes
exports.listar = async (req, res) => {
  try {
    const reportes = await Reporte.findAll();
    res.json(reportes);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener reportes", error: error.message });
  }
};

// Crear reporte
exports.crear = async (req, res) => {
  try {
    const { tipo, formato } = req.body;

    const nuevoReporte = await Reporte.create({
      tipo,
      formato,
    });

    res.status(201).json(nuevoReporte);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear reporte", error: error.message });
  }
};

// --- USUARIOS ---
exports.reporteUsuariosExcel = async (req, res) => {
  const usuarios = await Usuario.findAll();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Usuarios");
  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "Usuario", key: "usuario" },
    { header: "Correo", key: "correo" },
    { header: "Nombre", key: "nombre" },
    { header: "Rol", key: "rol" },
  ];
  usuarios.forEach((u) => worksheet.addRow(u.dataValues));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=usuarios.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

exports.reporteUsuariosPDF = async (req, res) => {
  const usuarios = await Usuario.findAll();
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=usuarios.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Reporte de Usuarios", { align: "center" });
  doc.moveDown();
  usuarios.forEach((u) => {
    doc.fontSize(12).text(`ID: ${u.id} | Usuario: ${u.usuario} | Correo: ${u.correo} | Nombre: ${u.nombre} | Rol: ${u.rol}`);
  });
  doc.end();
};

// --- SOLICITUDES ---
exports.reporteSolicitudesExcel = async (req, res) => {
  const solicitudes = await Solicitud.findAll();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Solicitudes");
  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "Cliente ID", key: "cliente_id" },
    { header: "Fecha Solicitud", key: "fecha_solicitud" },
    { header: "Estado", key: "estado" },
    { header: "Observaciones", key: "observaciones" },
  ];
  solicitudes.forEach((s) => worksheet.addRow(s.dataValues));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=solicitudes.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

exports.reporteSolicitudesPDF = async (req, res) => {
  const solicitudes = await Solicitud.findAll();
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=solicitudes.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Reporte de Solicitudes", { align: "center" });
  doc.moveDown();
  solicitudes.forEach((s) => {
    doc.fontSize(12).text(`ID: ${s.id} | Cliente ID: ${s.cliente_id} | Fecha: ${s.fecha_solicitud} | Estado: ${s.estado} | Obs: ${s.observaciones}`);
  });
  doc.end();
};

// --- VEHICULOS ---
exports.reporteVehiculosExcel = async (req, res) => {
  const vehiculos = await Vehiculo.findAll();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Vehículos");
  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "Placa", key: "placa" },
    { header: "Marca", key: "marca" },
    { header: "Modelo", key: "modelo" },
    { header: "Año", key: "anio" },
    { header: "Estado", key: "estado" },
  ];
  vehiculos.forEach((v) => worksheet.addRow(v.dataValues));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=vehiculos.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

exports.reporteVehiculosPDF = async (req, res) => {
  const vehiculos = await Vehiculo.findAll();
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=vehiculos.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Reporte de Vehículos", { align: "center" });
  doc.moveDown();
  vehiculos.forEach((v) => {
    doc.fontSize(12).text(`ID: ${v.id} | Placa: ${v.placa} | Marca: ${v.marca} | Modelo: ${v.modelo} | Año: ${v.anio} | Estado: ${v.estado}`);
  });
  doc.end();
};

// --- PEDIDOS ---
exports.reportePedidosExcel = async (req, res) => {
  const pedidos = await Pedido.findAll();
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Pedidos");
  worksheet.columns = [
    { header: "ID", key: "id" },
    { header: "Solicitud ID", key: "solicitud_id" },
    { header: "Cliente ID", key: "cliente_id" },
    { header: "Material", key: "material" },
    { header: "Cantidad (ton)", key: "cantidad_toneladas" },
    { header: "Dirección Entrega", key: "direccion_entrega" },
    { header: "Fecha Entrega", key: "fecha_entrega" },
    { header: "Estado", key: "estado" },
  ];
  pedidos.forEach((p) => worksheet.addRow(p.dataValues));
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", "attachment; filename=pedidos.xlsx");
  await workbook.xlsx.write(res);
  res.end();
};

exports.reportePedidosPDF = async (req, res) => {
  const pedidos = await Pedido.findAll();
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=pedidos.pdf");
  doc.pipe(res);
  doc.fontSize(18).text("Reporte de Pedidos", { align: "center" });
  doc.moveDown();
  pedidos.forEach((p) => {
    doc.fontSize(12).text(`ID: ${p.id} | Solicitud ID: ${p.solicitud_id} | Cliente ID: ${p.cliente_id} | Material: ${p.material} | Cantidad: ${p.cantidad_toneladas} | Dirección: ${p.direccion_entrega} | Fecha: ${p.fecha_entrega} | Estado: ${p.estado}`);
  });
  doc.end();
};
