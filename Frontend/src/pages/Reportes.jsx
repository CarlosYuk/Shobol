import React from "react";

const endpoints = [
  {
    name: "Usuarios",
    excel: "http://localhost:5000/api/reportes/usuarios/excel",
    pdf: "http://localhost:5000/api/reportes/usuarios/pdf",
  },
  {
    name: "Solicitudes",
    excel: "http://localhost:5000/api/reportes/solicitudes/excel",
    pdf: "http://localhost:5000/api/reportes/solicitudes/pdf",
  },
  {
    name: "Vehículos",
    excel: "http://localhost:5000/api/reportes/vehiculos/excel",
    pdf: "http://localhost:5000/api/reportes/vehiculos/pdf",
  },
  {
    name: "Pedidos",
    excel: "http://localhost:5000/api/reportes/pedidos/excel",
    pdf: "http://localhost:5000/api/reportes/pedidos/pdf",
  },
];

const Reportes = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Descargar Reportes</h2>
    <ul>
      {endpoints.map((r) => (
        <li key={r.name} className="mb-4 flex items-center space-x-4">
          <span className="font-semibold">{r.name}</span>
          <a
            href={r.excel}
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            download
          >
            Excel
          </a>
          <a
            href={r.pdf}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            download
          >
            PDF
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default Reportes;
