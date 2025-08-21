import React, { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AprobarPedidoModal from "./AprobarPedidoModal";

const estadoColor = {
  asignado: "bg-blue-100 text-blue-800",
  en_transito: "bg-amber-100 text-amber-800",
  entregado: "bg-gray-100 text-gray-800",
  pendiente: "bg-red-100 text-red-800",
};

const estadoTexto = {
  asignado: "Asignado",
  en_transito: "En Tránsito",
  entregado: "Entregado",
  pendiente: "Pendiente",
};

const PedidosTable = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showVehiculoModal, setShowVehiculoModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [vehiculoId, setVehiculoId] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [showDetallesModal, setShowDetallesModal] = useState(false);
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const [modalSolicitud, setModalSolicitud] = useState(null);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getPedidos();
      setPedidos(Array.isArray(data) ? data : []);
    } catch {
      setPedidos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      const data = await ApiService.getVehiculos();
      setVehiculos(Array.isArray(data) ? data : []);
    } catch {
      setVehiculos([]);
    }
  };

  const openAsignarVehiculoModal = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    cargarVehiculos();
    setShowVehiculoModal(true);
  };

  const handleAsignarVehiculo = async () => {
    try {
      await ApiService.asignarVehiculoPedido(pedidoSeleccionado, vehiculoId);
      setShowVehiculoModal(false);
      setVehiculoId("");
      setPedidoSeleccionado(null);
      cargarPedidos();
      toast.success("Vehículo asignado correctamente");
    } catch (error) {
      toast.error(error.message || "No se pudo asignar el vehículo");
    }
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    await ApiService.cambiarEstadoPedido(pedidoId, nuevoEstado);
    cargarPedidos();
    toast.success("Acción realizada correctamente");
  };

  const exportarExcel = () => {
    const datos = pedidosBuscados.map((p) => ({
      ID: p.id,
      Solicitud: p.solicitud_id,
      "Cantidad (ton)": p.cantidad_toneladas,
      Dirección: p.direccion_entrega,
      "Fecha Entrega": p.fecha_entrega,
      Estado: p.estado,
      Vehículo: p.vehiculo_id
        ? vehiculos.find((v) => v.id === p.vehiculo_id)?.placa || p.vehiculo_id
        : "Sin asignar",
    }));
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Pedidos");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "pedidos.xlsx");
  };

  const pedidosFiltrados = Array.isArray(pedidos)
    ? filtroEstado
      ? pedidos.filter((p) => p.estado === filtroEstado)
      : pedidos
    : [];

  const pedidosBuscados = Array.isArray(pedidosFiltrados)
    ? busqueda
      ? pedidosFiltrados.filter(
          (p) =>
            p.direccion_entrega
              .toLowerCase()
              .includes(busqueda.toLowerCase()) ||
            p.solicitud_id.toString().includes(busqueda)
        )
      : pedidosFiltrados
    : [];

  const openDetallesModal = (pedido) => {
    setPedidoDetalle(pedido);
    setShowDetallesModal(true);
  };

  const eliminarPedido = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este pedido?")) {
      await ApiService.deletePedido(id);
      cargarPedidos();
      toast.success("Pedido eliminado correctamente");
    }
  };

  // División: pedidos asignados y entregados
  const pedidosAsignados = pedidosBuscados.filter(
    (p) => p.estado !== "entregado"
  );
  const pedidosEntregados = pedidosBuscados.filter(
    (p) => p.estado === "entregado"
  );

  if (loading) return <div className="p-8">Cargando pedidos...</div>;

  return (
    <div className="p-8">
      {/* Tabla de pedidos asignados */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-blue-700 text-center">
          Pedidos Asignados
        </h2>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead className="bg-blue-600 text-white rounded-t-xl">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-xl">ID</th>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Fecha de entrega</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Material</th>
                <th className="px-4 py-3 text-left">Acción</th>
                <th className="px-4 py-3 text-left rounded-tr-xl">Vehículo</th>
              </tr>
            </thead>
            <tbody>
              {pedidosAsignados.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No tienes pedidos asignados.
                  </td>
                </tr>
              )}
              {pedidosAsignados.map((p, idx) => (
                <tr
                  key={p.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="border px-4 py-3">{p.id}</td>
                  <td className="border px-4 py-3">{p.cliente_id}</td>
                  <td className="border px-4 py-3">
                    {p.fecha_entrega
                      ? new Date(p.fecha_entrega).toLocaleString()
                      : ""}
                  </td>
                  <td className="border px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                        estadoColor[p.estado]
                      }`}
                    >
                      {estadoTexto[p.estado] || p.estado}
                    </span>
                  </td>
                  <td className="border px-4 py-3">{p.material}</td>
                  <td className="border px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <button
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => openDetallesModal(p)}
                      >
                        Ver detalles
                      </button>
                      <button
                        className="text-emerald-600 hover:underline font-medium"
                        onClick={() => openAsignarVehiculoModal(p.id)}
                      >
                        Asignar vehículo
                      </button>
                    </div>
                  </td>
                  <td className="border px-4 py-3">{p.vehiculo_id || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Tabla de pedidos entregados */}
      <div>
        <h2 className="text-lg font-bold mb-4 text-gray-700 text-center">
          Pedidos Entregados
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow border border-gray-200">
            <thead className="bg-gray-700 text-white rounded-t-xl">
              <tr>
                <th className="px-4 py-3 text-left rounded-tl-xl">Fecha</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Motivo</th>
                <th className="px-4 py-3 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidosEntregados.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No tienes pedidos entregados.
                  </td>
                </tr>
              )}
              {pedidosEntregados.map((p, idx) => (
                <tr
                  key={p.id}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-gray-50"
                      : "bg-gray-50 hover:bg-gray-100"
                  }
                >
                  <td className="border px-4 py-3">
                    {p.fecha_entrega
                      ? new Date(p.fecha_entrega).toLocaleString()
                      : ""}
                  </td>
                  <td className="border px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full font-semibold text-sm ${
                        estadoColor[p.estado]
                      }`}
                    >
                      {estadoTexto[p.estado] || p.estado}
                    </span>
                  </td>
                  <td className="border px-4 py-3">
                    {p.estado === "no_entregado" ? p.motivo_no_entregado || "-" : "-"}
                  </td>
                  <td className="border px-4 py-3">
                    <button
                      className="text-gray-600 hover:underline font-medium"
                      onClick={() => openDetallesModal(p)}
                    >
                      Ver detalles
                    </button>
                    {p.estado === "no_entregado" && (
                      <button
                        className="text-emerald-600 hover:underline font-medium"
                        onClick={() => openAsignarVehiculoModal(p.id)}
                      >
                        Reasignar pedido
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showVehiculoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
            <h3 className="text-lg font-bold mb-4">Asignar Vehículo</h3>
            <select
              className="w-full mb-4 px-3 py-2 border rounded"
              value={vehiculoId}
              onChange={(e) => setVehiculoId(e.target.value)}
            >
              <option value="">Selecciona un vehículo</option>
              {vehiculos
                .filter((v) => v.estado === "disponible")
                .map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.placa} - {v.modelo}
                  </option>
                ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
                onClick={handleAsignarVehiculo}
                disabled={!vehiculoId}
              >
                Asignar
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setShowVehiculoModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      {showDetallesModal && pedidoDetalle && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] max-w-md w-full relative">
            <button
              onClick={() => setShowDetallesModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
              title="Cerrar"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-emerald-700">
              Detalles del Pedido
            </h3>
            <div className="space-y-2">
              <div>
                <b>ID Pedido:</b> {pedidoDetalle.id}
              </div>
              <div>
                <b>Cliente:</b>{" "}
                {pedidoDetalle.solicitud?.nombreCliente ||
                  pedidoDetalle.cliente_nombre ||
                  pedidoDetalle.cliente_id ||
                  "-"}
              </div>
              <div>
                <b>Empresa:</b>{" "}
                {pedidoDetalle.solicitud?.nombreEmpresa ||
                  pedidoDetalle.empresa_nombre ||
                  "-"}
              </div>
              <div>
                <b>Solicitud:</b> {pedidoDetalle.solicitud_id}
              </div>
              <div>
                <b>Cantidad (ton):</b> {pedidoDetalle.cantidad_toneladas}
              </div>
              <div>
                <b>Material:</b> {pedidoDetalle.material || "-"}
              </div>
              <div>
                <b>Dirección de entrega:</b> {pedidoDetalle.direccion_entrega}
              </div>
              <div>
                <b>Fecha Entrega:</b>{" "}
                {pedidoDetalle.fecha_entrega
                  ? new Date(pedidoDetalle.fecha_entrega).toLocaleString()
                  : "-"}
              </div>
              <div>
                <b>Estado:</b>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full font-semibold text-sm ${
                    estadoColor[pedidoDetalle.estado]
                  }`}
                >
                  {estadoTexto[pedidoDetalle.estado] || pedidoDetalle.estado}
                </span>
              </div>
              <div>
                <b>Vehículo:</b>{" "}
                {pedidoDetalle.vehiculo
                  ? `${pedidoDetalle.vehiculo.numero_vehiculo} (${pedidoDetalle.vehiculo.placa})`
                  : pedidoDetalle.vehiculo_id || "Sin asignar"}
              </div>
              {pedidoDetalle.vehiculo && (
                <>
                  <div>
                    <b>Propietario:</b>{" "}
                    {pedidoDetalle.vehiculo.nombre_propietario}
                  </div>
                  <div>
                    <b>Chofer:</b> {pedidoDetalle.vehiculo.nombre_chofer}
                  </div>
                </>
              )}
              {/* Copia otros datos importantes de la solicitud si existen */}
              {pedidoDetalle.solicitud && (
                <>
                  <div>
                    <b>Observaciones:</b>{" "}
                    {pedidoDetalle.solicitud.observaciones || "-"}
                  </div>
                  <div>
                    <b>Fecha Solicitud:</b>{" "}
                    {pedidoDetalle.solicitud.fecha_solicitud
                      ? new Date(
                          pedidoDetalle.solicitud.fecha_solicitud
                        ).toLocaleString()
                      : "-"}
                  </div>
                  <div>
                    <b>Lugar de entrega:</b>{" "}
                    {pedidoDetalle.solicitud.lugar_entrega || "-"}
                  </div>
                </>
              )}
              {pedidoDetalle.estado === "no_entregado" && (
                <div>
                  <b>Motivo no entregado:</b> {pedidoDetalle.motivo_no_entregado || "-"}
                </div>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setShowDetallesModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalSolicitud && (
        <AprobarPedidoModal
          solicitud={modalSolicitud}
          onClose={() => setModalSolicitud(null)}
          onAprobado={cargarPedidos}
        />
      )}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default PedidosTable;
