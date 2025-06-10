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
}

export default new ApiService();
