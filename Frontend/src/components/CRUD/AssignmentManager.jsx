import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import apiService from '../../services/api.js';

const AssignmentManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    pedido_id: '',
    ruta_id: '',
    vehiculo_id: '',
    gestor_id: '',
    fecha_asignacion: '',
    estado: 'pendiente'
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAssignments();
      setAssignments(data);
    } catch (err) {
      setError('Error al cargar las asignaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await apiService.put(`/asignaciones/${editingAssignment.id}`, formData);
      } else {
        await apiService.createAssignment(formData);
      }
      
      await loadAssignments();
      resetForm();
    } catch (err) {
      setError('Error al guardar la asignación');
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      pedido_id: assignment.pedido_id,
      ruta_id: assignment.ruta_id,
      vehiculo_id: assignment.vehiculo_id,
      gestor_id: assignment.gestor_id,
      fecha_asignacion: assignment.fecha_asignacion?.split('T')[0] || '',
      estado: assignment.estado
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta asignación?')) {
      try {
        await apiService.delete(`/asignaciones/${id}`);
        await loadAssignments();
      } catch (err) {
        setError('Error al eliminar la asignación');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      pedido_id: '',
      ruta_id: '',
      vehiculo_id: '',
      gestor_id: '',
      fecha_asignacion: '',
      estado: 'pendiente'
    });
    setEditingAssignment(null);
    setShowForm(false);
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.pedido_id?.toString().includes(searchTerm) ||
                         assignment.ruta_id?.toString().includes(searchTerm) ||
                         assignment.vehiculo_id?.toString().includes(searchTerm);
    const matchesFilter = !filterStatus || assignment.estado === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Gestión de Asignaciones</h1>
          <p className="text-stone-600">Administrar asignaciones de pedidos a rutas y vehículos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nueva Asignación</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                type="text"
                placeholder="Buscar por pedido, ruta o vehículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-stone-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Assignments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-stone-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Vehículo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-stone-200">
              {filteredAssignments.map((assignment) => (
                <tr key={assignment.id} className="hover:bg-stone-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-stone-900">
                    {assignment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {assignment.pedido_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {assignment.ruta_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {assignment.vehiculo_id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      assignment.estado === 'completada' ? 'bg-emerald-100 text-emerald-800' :
                      assignment.estado === 'en_progreso' ? 'bg-blue-100 text-blue-800' :
                      assignment.estado === 'cancelada' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {assignment.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                    {assignment.fecha_asignacion ? new Date(assignment.fecha_asignacion).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-stone-900 mb-4">
                {editingAssignment ? 'Editar Asignación' : 'Nueva Asignación'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    ID del Pedido
                  </label>
                  <input
                    type="text"
                    value={formData.pedido_id}
                    onChange={(e) => setFormData({...formData, pedido_id: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    ID de la Ruta
                  </label>
                  <input
                    type="text"
                    value={formData.ruta_id}
                    onChange={(e) => setFormData({...formData, ruta_id: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    ID del Vehículo
                  </label>
                  <input
                    type="text"
                    value={formData.vehiculo_id}
                    onChange={(e) => setFormData({...formData, vehiculo_id: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    ID del Gestor
                  </label>
                  <input
                    type="text"
                    value={formData.gestor_id}
                    onChange={(e) => setFormData({...formData, gestor_id: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Fecha de Asignación
                  </label>
                  <input
                    type="date"
                    value={formData.fecha_asignacion}
                    onChange={(e) => setFormData({...formData, fecha_asignacion: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_progreso">En Progreso</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-lime-600 hover:from-emerald-700 hover:to-lime-700 text-white py-2 px-4 rounded-lg"
                  >
                    {editingAssignment ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-stone-300 hover:bg-stone-400 text-stone-700 py-2 px-4 rounded-lg"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManager;