import React, { useState } from "react";
import { solicitarRecuperacion } from "../../services/api";

const RecuperarContrasena = () => {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    try {
      await solicitarRecuperacion(correo);
      setMensaje("Si el correo existe, recibirás instrucciones para restablecer tu contraseña.");
    } catch {
      setError("Hubo un error. Intenta de nuevo.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Recuperar Contraseña</h2>
      <input
        type="email"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
        placeholder="Tu correo"
        required
        className="w-full mb-4 px-4 py-2 border rounded"
      />
      <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded">Enviar</button>
      {mensaje && <div className="mt-4 text-green-600">{mensaje}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </form>
  );
};

export default RecuperarContrasena;