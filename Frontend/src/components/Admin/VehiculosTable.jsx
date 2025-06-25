import React, { useState, useEffect } from "react";
import ApiService from "../../services/api";

const estados = ["disponible", "mantenimiento", "no_disponible"];
const anioActual = new Date().getFullYear();

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
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const cargarVehiculos = async () => {
    setCargando(true);
    try {
      const data = await ApiService.getVehiculos();
      setVehiculos(data);
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cargar vehículos." });
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const validar = (datos) => {
    const err = {};
    if (!datos.placa || datos.placa.length < 5)
      err.placa = "Placa requerida (mínimo 5 caracteres)";
    if (!datos.modelo || datos.modelo.length < 2)
      err.modelo = "Modelo requerido";
    const anioNum = Number(datos.anio);
    if (
      !datos.anio ||
      isNaN(anioNum) ||
      anioNum < 1900 ||
      anioNum > anioActual
    ) {
      err.anio = `Año debe estar entre 1900 y ${anioActual}`;
    }
    return err;
  };

  const handleChange = (e) => {
    let value = e.target.value;
    if (e.target.name === "anio") {
      value = value.replace(/\D/, "");
      if (value.length > 4) value = value.slice(0, 4);
      if (Number(value) > anioActual) value = anioActual.toString();
    }
    const nuevoForm = { ...form, [e.target.name]: value };
    setForm(nuevoForm);
    setErrores(validar(nuevoForm));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar(form);
    setErrores(err);
    if (Object.keys(err).length > 0) return;
    setEnviando(true);
    try {
      if (editando) {
        await ApiService.actualizarVehiculo(editando.id, form);
        setMensaje({ tipo: "exito", texto: "Vehículo actualizado correctamente." });
      } else {
        await ApiService.crearVehiculo(form);
        setMensaje({ tipo: "exito", texto: "Vehículo creado correctamente." });
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
    } catch {
      setMensaje({ tipo: "error", texto: "Error al guardar el vehículo." });
    }
    setEnviando(false);
    setTimeout(() => setMensaje(null), 3000);
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
    setErrores({});
    setShowForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este vehículo?")) {
      try {
        await ApiService.eliminarVehiculo(id);
        setMensaje({ tipo: "exito", texto: "Vehículo eliminado correctamente." });
        cargarVehiculos();
      } catch {
        setMensaje({ tipo: "error", texto: "Error al eliminar el vehículo." });
      }
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const cambiarEstadoVehiculo = async (id, nuevoEstado) => {
    try {
      await ApiService.cambiarEstadoVehiculo(id, nuevoEstado);
      setMensaje({ tipo: "exito", texto: "Estado actualizado correctamente." });
      cargarVehiculos();
    } catch {
      setMensaje({ tipo: "error", texto: "Error al cambiar el estado del vehículo." });
    }
    setTimeout(() => setMensaje(null), 3000);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
      {mensaje && (
        <div
          className={`mb-4 p-2 rounded ${
            mensaje.tipo === "exito"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {mensaje.texto}
        </div>
      )}
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
          setErrores({});
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
            <div className="w-full">
              <input
                name="placa"
                value={form.placa}
                onChange={handleChange}
                placeholder="Placa"
                required
                minLength={5}
                className="border px-2 py-1 rounded w-full"
              />
              {errores.placa && (
                <span className="text-red-600 text-xs">{errores.placa}</span>
              )}
            </div>
            <div className="w-full">
              <input
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                placeholder="Modelo"
                required
                minLength={2}
                className="border px-2 py-1 rounded w-full"
              />
              {errores.modelo && (
                <span className="text-red-600 text-xs">{errores.modelo}</span>
              )}
            </div>
            <div className="w-full">
              <input
                name="anio"
                value={form.anio}
                onChange={handleChange}
                placeholder="Año"
                type="number"
                required
                min={1900}
                max={anioActual}
                className="border px-2 py-1 rounded w-full"
              />
              {errores.anio && (
                <span className="text-red-600 text-xs">{errores.anio}</span>
              )}
            </div>
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
              disabled={Object.keys(errores).length > 0 || enviando}
            >
              {enviando ? "Guardando..." : editando ? "Actualizar" : "Guardar"}
            </button>
            <button
              type="button"
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => {
                setShowForm(false);
                setEditando(null);
                setErrores({});
              }}
              disabled={enviando}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
      {cargando ? (
        <div className="text-center py-8">Cargando vehículos...</div>
      ) : (
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
                    onChange={(e) =>
                      cambiarEstadoVehiculo(v.id, e.target.value)
                    }
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
      )}
    </div>
  );
};

export default VehiculosTable;
