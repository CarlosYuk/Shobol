const API_BASE_URL = "http://localhost:5000/api";

class ApiService {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  }

  async login({ correo, contrasena }) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ correo, contrasena }),
    });
  }

  async register(userData) {
    return this.request("/auth/registro", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  // Métodos CRUD genéricos
  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }

  // Métodos específicos para cada recurso
  async getAssignments() {
    return this.get("/asignaciones");
  }

  async createAssignment(assignment) {
    return this.post("/asignaciones", assignment);
  }

  async getRequests() {
    return this.get("/solicitudes");
  }

  async createRequest(request) {
    return this.post("/solicitudes", request);
  }

  async getLoads() {
    return this.get("/cargas");
  }

  async createLoad(load) {
    return this.post("/cargas", load);
  }

  async getRoutes() {
    return this.get("/rutas");
  }

  async createRoute(route) {
    return this.post("/rutas", route);
  }

  async getVehicles() {
    return this.get("/vehiculos");
  }

  async createVehicle(vehicle) {
    return this.post("/vehiculos", vehicle);
  }

  async getReports() {
    return this.get("/reportes");
  }

  async getUsers() {
    return this.get("/usuarios");
  }

  async createUser(user) {
    return this.post("/usuarios", user);
  }

  async updateUser(id, user) {
    return this.put(`/usuarios/${id}`, user);
  }

  async deleteUser(id) {
    return this.delete(`/usuarios/${id}`);
  }

  async createSolicitud(data) {
    return this.post("/solicitudes", data);
  }

  async createPedido(data) {
    return this.post("/pedidos", data);
  }

  async getPedidos() {
    return this.get("/pedidos");
  }

  async asignarVehiculoPedido(id, vehiculo_id) {
    return this.put(`/pedidos/${id}/asignar-vehiculo`, { vehiculo_id });
  }

  async cambiarEstadoPedido(id, estado) {
    if (estado === "entregado") {
      return this.put(`/pedidos/${id}/entregar`);
    }
    // Si quieres cambiar a otros estados, usa actualizarPedido:
    return this.put(`/pedidos/${id}`, { estado });
  }

  async deletePedido(id) {
    return this.delete(`/pedidos/${id}`);
  }

  async aprobarSolicitud(id, data) {
    return this.put(`/solicitudes/${id}/aprobar`, data);
  }

  getVehiculos() {
    return this.get("/vehiculos");
  }

  crearVehiculo(data) {
    return this.post("/vehiculos", data);
  }

  actualizarVehiculo(id, data) {
    return this.put(`/vehiculos/${id}`, data);
  }

  eliminarVehiculo(id) {
    return this.delete(`/vehiculos/${id}`);
  }

  cambiarEstadoVehiculo(id, estado) {
    return this.put(`/vehiculos/${id}/estado`, { estado });
  }

  async marcarPedidoEntregado(id) {
    return this.put(`/pedidos/${id}/entregar`);
  }

  async getVehiculosDisponibles() {
    return this.get("/vehiculos/disponibles");
  }
}

export default new ApiService();

export async function aceptarSolicitud(id) {
  const res = await fetch(`${API_BASE_URL}/solicitudes/${id}/aceptar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Error al aceptar");
  return res.json();
}

export async function rechazarSolicitud(id, motivo) {
  const res = await fetch(`${API_BASE_URL}/solicitudes/${id}/rechazar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ motivo }),
  });
  if (!res.ok) throw new Error("Error al rechazar");
  return res.json();
}

export async function getSolicitudesCliente() {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/solicitudes/cliente", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener solicitudes");
  return res.json();
}

export async function solicitarRecuperacion(correo) {
  await fetch("http://localhost:5000/api/auth/recuperar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo }),
  });
}

export async function restablecerContrasena(token, contrasena) {
  await fetch("http://localhost:5000/api/auth/restablecer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, contrasena }),
  });
}
