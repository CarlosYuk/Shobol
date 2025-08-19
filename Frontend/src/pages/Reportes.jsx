import React from "react";
import { FileSpreadsheet, FileText, Users, Truck, ClipboardList } from "lucide-react";

const endpoints = [
  {
    name: "Usuarios",
    excel: "http://localhost:5000/api/reportes/usuarios/excel",
    pdf: "http://localhost:5000/api/reportes/usuarios/pdf",
    icon: <Users className="h-6 w-6 text-emerald-600" />,
    description: "Reporte de todos los usuarios registrados en el sistema.",
  },
  {
    name: "Solicitudes",
    excel: "http://localhost:5000/api/reportes/solicitudes/excel",
    pdf: "http://localhost:5000/api/reportes/solicitudes/pdf",
    icon: <ClipboardList className="h-6 w-6 text-blue-600" />,
    description: "Solicitudes realizadas por los clientes.",
  },
  {
    name: "Vehículos",
    excel: "http://localhost:5000/api/reportes/vehiculos/excel",
    pdf: "http://localhost:5000/api/reportes/vehiculos/pdf",
    icon: <Truck className="h-6 w-6 text-lime-600" />,
    description: "Listado y estado de los vehículos.",
  },
  {
    name: "Pedidos",
    excel: "http://localhost:5000/api/reportes/pedidos/excel",
    pdf: "http://localhost:5000/api/reportes/pedidos/pdf",
    icon: <FileText className="h-6 w-6 text-amber-600" />,
    description: "Pedidos aprobados y entregados.",
  },
];

const Reportes = () => (
  <div className="p-8">
    <h2 className="text-2xl font-bold mb-4">Dashboard de Reportes</h2>
    <p className="mb-6 text-stone-600">
      Descarga reportes detallados en formato Excel o PDF para usuarios, solicitudes, vehículos y pedidos.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {endpoints.map((r) => (
        <div key={r.name} className="bg-white rounded-xl shadow border border-stone-200 p-6 flex flex-col">
          <div className="flex items-center mb-3">
            {r.icon}
            <span className="ml-3 text-lg font-semibold text-stone-900">{r.name}</span>
          </div>
          <p className="text-stone-600 mb-4">{r.description}</p>
          <div className="flex space-x-3 mt-auto">
            <a
              href={r.excel}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              download
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Excel
            </a>
            <a
              href={r.pdf}
              className="flex items-center bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              download
            >
              <FileText className="h-4 w-4 mr-2" />
              PDF
            </a>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Reportes;
