import React, { useState, useEffect } from "react";
import ApiService from "../../services/api";

const VehiculosTable = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevo, setNuevo] = useState({
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
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await ApiService.crearVehiculo(nuevo);
    setShowForm(false);
    setNuevo({
      placa: "",
      modelo: "",
      anio: "",
      nombre_chofer: "",
      nombre_propietario: "",
      estado: "disponible",
    });
    cargarVehiculos();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
      <button
        className="mb-4 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancelar" : "Nuevo Vehículo"}
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2">
          <input name="placa" value={nuevo.placa} onChange={handleChange} placeholder="Placa" required className="border px-2 py-1 rounded" />
          <input name="modelo" value={nuevo.modelo} onChange={handleChange} placeholder="Modelo" required className="border px-2 py-1 rounded" />
          <input name="anio" value={nuevo.anio} onChange={handleChange} placeholder="Año" type="number" required className="border px-2 py-1 rounded" />
          <input name="nombre_chofer" value={nuevo.nombre_chofer} onChange={handleChange} placeholder="Chofer" className="border px-2 py-1 rounded" />
          <input name="nombre_propietario" value={nuevo.nombre_propietario} onChange={handleChange} placeholder="Propietario" className="border px-2 py-1 rounded" />
          <select name="estado" value={nuevo.estado} onChange={handleChange} className="border px-2 py-1 rounded">
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">Mantenimiento</option>
            <option value="no_disponible">No disponible</option>
          </select>
          <button type="submit" className="bg-emerald-600 text-white px-3 py-1 rounded">Guardar</button>
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
              <td>{v.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiculosTable;