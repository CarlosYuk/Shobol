import React, { useEffect, useState } from "react";
import ApiService from "../../services/api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import AprobarPedidoModal from "./AprobarPedidoModal"; // Ajusta la ruta

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
      setPedidos(data);
    } catch {
      setPedidos([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  // Abrir modal y cargar vehículos
  const openAsignarVehiculoModal = async (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    const lista = await ApiService.getVehicles();
    setVehiculos(lista);
    setShowVehiculoModal(true);
  };

  // Asignar vehículo
  const handleAsignarVehiculo = async () => {
    await ApiService.asignarVehiculoPedido(pedidoSeleccionado, vehiculoId);
    setShowVehiculoModal(false);
    setVehiculoId("");
    setPedidoSeleccionado(null);
    cargarPedidos(); // refresca la tabla
    toast.success("Acción realizada correctamente");
  };

  // Cambiar estado
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

  const pedidosFiltrados = filtroEstado
    ? pedidos.filter((p) => p.estado === filtroEstado)
    : pedidos;

  const pedidosBuscados = busqueda
    ? pedidosFiltrados.filter(
        (p) =>
          p.direccion_entrega.toLowerCase().includes(busqueda.toLowerCase()) ||
          p.solicitud_id.toString().includes(busqueda)
      )
    : pedidosFiltrados;

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

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Filtrar por estado:</label>
        <select
          className="border rounded px-2 py-1"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="pendiente">Pendiente</option>
          <option value="asignado">Asignado</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="mr-2 font-semibold">Buscar:</label>
        <input
          type="text"
          className="border rounded px-2 py-1"
          placeholder="Dirección o Solicitud"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <button
        className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        onClick={exportarExcel}
      >
        Exportar a Excel
      </button>
      <div className="overflow-x-auto rounded shadow bg-white">
        {loading ? (
          <div className="text-center py-8 text-emerald-600 font-semibold">
            Cargando pedidos...
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-emerald-600">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  ID
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Solicitud
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Cantidad (ton)
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Dirección
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Fecha Entrega
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Estado
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Acciones
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">
                  Vehículo
                </th>
                {/* Puedes agregar más columnas según tu modelo */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedidosBuscados.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No hay pedidos registrados.
                  </td>
                </tr>
              )}
              {pedidosBuscados.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2">{p.id}</td>
                  <td className="px-4 py-2">{p.solicitud_id}</td>
                  <td className="px-4 py-2">{p.cantidad_toneladas}</td>
                  <td className="px-4 py-2">{p.direccion_entrega}</td>
                  <td className="px-4 py-2">
                    {p.fecha_entrega
                      ? new Date(p.fecha_entrega).toLocaleDateString()
                      : ""}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    <select
                      value={p.estado}
                      onChange={(e) =>
                        cambiarEstadoPedido(p.id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                      disabled={
                        p.estado === "entregado" || p.estado === "cancelado"
                      }
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="asignado">Asignado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => openAsignarVehiculoModal(p.id)}
                      disabled={
                        p.estado === "entregado" || p.estado === "cancelado"
                      }
                    >
                      Asignar Vehículo
                    </button>
                    {!(
                      p.estado === "entregado" || p.estado === "cancelado"
                    ) && (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded ml-2"
                        onClick={() => cambiarEstadoPedido(p.id, "entregado")}
                      >
                        Marcar como Entregado
                      </button>
                    )}
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => openDetallesModal(p)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="bg-red-600 text-white px-2 py-1 rounded ml-2"
                      onClick={() => eliminarPedido(p.id)}
                      disabled={
                        p.estado === "entregado" || p.estado === "cancelado"
                      }
                    >
                      Eliminar
                    </button>
                    {/* <button
                      className="bg-green-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => setModalSolicitud(p)}
                    >
                      Aprobar y crear pedido
                    </button> */}  
                  </td>
                  <td className="px-4 py-2">
                    {p.vehiculo_id
                      ? vehiculos.find((v) => v.id === p.vehiculo_id)?.placa ||
                        p.vehiculo_id
                      : "Sin asignar"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
              {vehiculos.map((v) => (
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
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px]">
            <h3 className="text-lg font-bold mb-4">Detalles del Pedido</h3>
            <div className="mb-2">
              <b>ID:</b> {pedidoDetalle.id}
            </div>
            <div className="mb-2">
              <b>Solicitud:</b> {pedidoDetalle.solicitud_id}
            </div>
            <div className="mb-2">
              <b>Cantidad (ton):</b> {pedidoDetalle.cantidad_toneladas}
            </div>
            <div className="mb-2">
              <b>Dirección:</b> {pedidoDetalle.direccion_entrega}
            </div>
            <div className="mb-2">
              <b>Fecha Entrega:</b> {pedidoDetalle.fecha_entrega}
            </div>
            <div className="mb-2">
              <b>Estado:</b> {pedidoDetalle.estado}
            </div>
            <div className="mb-2">
              <b>Vehículo:</b>{" "}
              {pedidoDetalle.vehiculo_id
                ? vehiculos.find((v) => v.id === pedidoDetalle.vehiculo_id)
                    ?.placa || pedidoDetalle.vehiculo_id
                : "Sin asignar"}
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
