import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { restablecerContrasena } from "../../services/api";

const RestablecerContrasena = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); setError("");
    try {
      await restablecerContrasena(token, contrasena);
      setMensaje("Contraseña restablecida. Ahora puedes iniciar sesión.");
    } catch {
      setError("Token inválido o expirado.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Restablecer Contraseña</h2>
      <input
        type="password"
        value={contrasena}
        onChange={e => setContrasena(e.target.value)}
        placeholder="Nueva contraseña"
        required
      />
      <button type="submit">Restablecer</button>
      {mensaje && <div>{mensaje}</div>}
      {error && <div style={{color:"red"}}>{error}</div>}
    </form>
  );
};

export default RestablecerContrasena;