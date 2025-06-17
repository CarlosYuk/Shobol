import React, { useState, useEffect } from "react";
import ApiService from "../../services/api";

const estados = ["disponible", "mantenimiento", "no_disponible"];

const VehiculosTable = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    placa: "",
    modelo: "",
    anio: "",
    nombre_chofer: "",
    nombre_propietario: "",
    estado: "disponible",
  });

  const cargarVehiculos = async () => {
    const data = await ApiService.getVehiculos();
    setVehiculos(data);
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editando) {
      await ApiService.actualizarVehiculo(editando.id, form);
    } else {
      await ApiService.crearVehiculo(form);
    }
    setShowForm(false);
    setEditando(null);
    setForm({
      placa: "",
      modelo: "",
      anio: "",
      nombre_chofer: "",
      nombre_propietario: "",
      estado: "disponible",
    });
    cargarVehiculos();
  };

  const handleEditar = (vehiculo) => {
    setEditando(vehiculo);
    setForm({
      placa: vehiculo.placa,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      nombre_chofer: vehiculo.nombre_chofer,
      nombre_propietario: vehiculo.nombre_propietario,
      estado: vehiculo.estado,
    });
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
      await ApiService.eliminarVehiculo(id);
      cargarVehiculos(); // Recarga la lista
    }
  };

  const cambiarEstadoVehiculo = async (id, nuevoEstado) => {
    await ApiService.cambiarEstadoVehiculo(id, nuevoEstado);
    cargarVehiculos();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
      <button
        className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        onClick={() => {
          setShowForm(true);
          setEditando(null);
          setForm({
            placa: "",
            modelo: "",
            anio: "",
            nombre_chofer: "",
            nombre_propietario: "",
            estado: "disponible",
          });
        }}
      >
        Nuevo Vehículo
      </button>
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 space-y-2 bg-white p-4 rounded shadow max-w-xl"
        >
          <div className="flex gap-2">
            <input
              name="placa"
              value={form.placa}
              onChange={handleChange}
              placeholder="Placa"
              required
              className="border px-2 py-1 rounded w-full"
            />
            <input
              name="modelo"
              value={form.modelo}
              onChange={handleChange}
              placeholder="Modelo"
              required
              className="border px-2 py-1 rounded w-full"
            />
            <input
              name="anio"
              value={form.anio}
              onChange={handleChange}
              placeholder="Año"
              type="number"
              required
              className="border px-2 py-1 rounded w-full"
            />
          </div>
          <div className="flex gap-2">
            <input
              name="nombre_chofer"
              value={form.nombre_chofer}
              onChange={handleChange}
              placeholder="Chofer"
              className="border px-2 py-1 rounded w-full"
            />
            <input
              name="nombre_propietario"
              value={form.nombre_propietario}
              onChange={handleChange}
              placeholder="Propietario"
              className="border px-2 py-1 rounded w-full"
            />
            <select
              name="estado"
              value={form.estado}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-full"
            >
              {estados.map((e) => (
                <option key={e} value={e}>
                  {e.charAt(0).toUpperCase() + e.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-emerald-600 text-white px-3 py-1 rounded"
            >
              {editando ? "Actualizar" : "Guardar"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => {
                setShowForm(false);
                setEditando(null);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      <table className="min-w-full divide-y divide-gray-200 bg-white rounded shadow">
        <thead>
          <tr>
            <th>Placa</th>
            <th>Modelo</th>
            <th>Año</th>
            <th>Chofer</th>
            <th>Propietario</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.placa}</td>
              <td>{v.modelo}</td>
              <td>{v.anio}</td>
              <td>{v.nombre_chofer}</td>
              <td>{v.nombre_propietario}</td>
              <td>
                <select
                  value={v.estado}
                  onChange={(e) => cambiarEstadoVehiculo(v.id, e.target.value)}
                  className="border rounded px-1 py-0.5"
                >
                  {estados.map((e) => (
                    <option key={e} value={e}>
                      {e.charAt(0).toUpperCase() + e.slice(1)}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="text-blue-600 mr-2"
                  onClick={() => handleEditar(v)}
                >
                  Editar
                </button>
                <button
                  className="text-red-600"
                  onClick={() => handleEliminar(v.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiculosTable;
