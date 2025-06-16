import React, { useEffect, useState } from "react";
import ApiService from "../../services/api";

const UsersTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ usuario: "", nombre: "", correo: "", rol: "cliente" });

  useEffect(() => {
    ApiService.getUsers()
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setForm({ usuario: "", nombre: "", correo: "", rol: "cliente" });
    setShowModal(true);
  };

  const openEditModal = (usuario) => {
    setEditingUser(usuario);
    setForm({
      usuario: usuario.usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await ApiService.updateUser(editingUser.id, form);
        setUsuarios(
          usuarios.map((u) => (u.id === editingUser.id ? { ...u, ...form } : u))
        );
      } else {
        const nuevo = await ApiService.createUser(form);
        setUsuarios([...usuarios, nuevo]);
      }
      setShowModal(false);
    } catch (error) {
      alert("Error al guardar usuario");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      try {
        await ApiService.deleteUser(id);
        setUsuarios(usuarios.filter((u) => u.id !== id));
      } catch (error) {
        alert("Error al eliminar usuario");
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Usuarios registrados</h2>
        <button
          onClick={openCreateModal}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow"
        >
          Crear Usuario
        </button>
      </div>
      <div className="overflow-x-auto rounded shadow bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-emerald-600">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Usuario</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Nombre</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Correo</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Rol</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-white uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2">{u.usuario}</td>
                <td className="px-4 py-2">{u.nombre}</td>
                <td className="px-4 py-2">{u.correo}</td>
                <td className="px-4 py-2 capitalize">{u.rol}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => openEditModal(u)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form
            className="bg-white p-8 rounded-lg shadow-lg min-w-[320px]"
            onSubmit={handleFormSubmit}
          >
            <h3 className="text-lg font-bold mb-4">{editingUser ? "Editar Usuario" : "Crear Usuario"}</h3>
            <input
              name="usuario"
              placeholder="Usuario"
              value={form.usuario}
              onChange={handleFormChange}
              required
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleFormChange}
              required
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              name="correo"
              placeholder="Correo"
              value={form.correo}
              onChange={handleFormChange}
              required
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <select
              name="rol"
              value={form.rol}
              onChange={handleFormChange}
              required
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              <option value="cliente">Cliente</option>
              <option value="gestor">Gestor</option>
              <option value="administrador">Administrador</option>
            </select>
            {!editingUser && (
              <input
                name="contrasena"
                type="password"
                placeholder="Contraseña"
                value={form.contrasena || ""}
                onChange={handleFormChange}
                required
                className="w-full mb-4 px-3 py-2 border rounded"
              />
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default UsersTable;