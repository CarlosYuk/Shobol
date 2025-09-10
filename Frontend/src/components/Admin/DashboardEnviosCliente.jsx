import React, { useState } from "react";
import ApiService from "../../services/api";

const DashboardEnviosCliente = () => {
  const [nombre, setNombre] = useState("");
  const [clientes, setClientes] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [info, setInfo] = useState(null);
  const [pedidosPorSemana, setPedidosPorSemana] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarClientes = async () => {
    setLoading(true);
    try {
      const data = await ApiService.buscarClientesPorNombre(nombre);
      setClientes(data);
    } catch {
      setClientes([]);
      alert("No se pudo buscar clientes");
    }
    setLoading(false);
  };

  const buscarEnvios = async (clienteId) => {
    setLoading(true);
    try {
      const data = await ApiService.getEnviosPorCliente(clienteId);
      setInfo(data);
      setPedidosPorSemana(null);
      setClienteSeleccionado(clientes.find(c => c.id === clienteId));
    } catch {
      setInfo(null);
      alert("No se pudo obtener la información del cliente");
    }
    setLoading(false);
  };

  const buscarEnviosPorSemana = async (clienteId) => {
    setLoading(true);
    try {
      const data = await ApiService.getEnviosPorClientePorSemana(clienteId);
      setPedidosPorSemana(data);
      setInfo(null);
      setClienteSeleccionado(clientes.find(c => c.id === clienteId));
    } catch {
      setPedidosPorSemana(null);
      alert("No se pudo obtener la información por semanas");
    }
    setLoading(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Buscar envíos por cliente</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={buscarClientes}
          className="bg-emerald-600 text-white px-4 py-2 rounded"
          disabled={!nombre || loading}
        >
          Buscar cliente
        </button>
      </div>
      {loading && <div>Cargando...</div>}
      {clientes.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Selecciona un cliente:</h3>
          <ul>
            {clientes.map(c => (
              <li key={c.id} className="mb-1">
                <button
                  className="text-blue-700 hover:underline"
                  onClick={() => buscarEnvios(c.id)}
                >
                  {c.nombre} ({c.correo})
                </button>
                <button
                  className="ml-2 text-emerald-700 hover:underline"
                  onClick={() => buscarEnviosPorSemana(c.id)}
                >
                  Ver por semanas
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Mensaje si no hay resultados */}
      {clientes.length === 0 && !loading && (
        <div className="text-gray-500 mt-2">No se encontraron clientes con ese nombre.</div>
      )}
      {info && (
        <div className="bg-white rounded shadow p-4">
          <h3 className="font-bold mb-2">
            Cliente: {info.cliente?.nombre} ({info.cliente?.correo})
          </h3>
          <p>Viajes realizados: <b>{info.cantidad_viajes}</b></p>
          <table className="min-w-full mt-4 border">
            <thead>
              <tr>
                <th className="px-2 py-1 border">Fecha</th>
                <th className="px-2 py-1 border">Material</th>
                <th className="px-2 py-1 border">Vehículo</th>
                <th className="px-2 py-1 border">Placa</th>
                <th className="px-2 py-1 border">Estado</th>
              </tr>
            </thead>
            <tbody>
              {info.viajes.map(v => (
                <tr key={v.id}>
                  <td className="border px-2 py-1">
                    {v.fecha_entrega ? new Date(v.fecha_entrega).toLocaleString() : "-"}
                  </td>
                  <td className="border px-2 py-1">{v.material}</td>
                  <td className="border px-2 py-1">{v.vehiculo?.numero_vehiculo || "-"}</td>
                  <td className="border px-2 py-1">{v.vehiculo?.placa || "-"}</td>
                  <td className="border px-2 py-1">{v.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pedidosPorSemana && (
        <div className="bg-white rounded shadow p-4 mt-4">
          <h3 className="font-bold mb-2">
            Pedidos por semana para {pedidosPorSemana.cliente?.nombre}
          </h3>
          {Object.entries(pedidosPorSemana.semanas).map(([semana, pedidos]) => (
            <div key={semana} className="mb-4">
              <h4 className="font-semibold mb-2">{semana}</h4>
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border">Fecha</th>
                    <th className="px-2 py-1 border">Material</th>
                    <th className="px-2 py-1 border">Vehículo</th>
                    <th className="px-2 py-1 border">Placa</th>
                    <th className="px-2 py-1 border">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map(v => (
                    <tr key={v.id}>
                      <td className="border px-2 py-1">
                        {v.fecha_entrega ? new Date(v.fecha_entrega).toLocaleString() : "-"}
                      </td>
                      <td className="border px-2 py-1">{v.material}</td>
                      <td className="border px-2 py-1">{v.vehiculo?.numero_vehiculo || "-"}</td>
                      <td className="border px-2 py-1">{v.vehiculo?.placa || "-"}</td>
                      <td className="border px-2 py-1">{v.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardEnviosCliente;