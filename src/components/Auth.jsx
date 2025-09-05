import React, { useState } from "react";
import { supabase } from "../supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setSent(!error);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 320, margin: "60px auto", background: "#fff", padding: 32, borderRadius: 10, boxShadow: "0 2px 12px #0001" }}>
      <h2>Iniciar sesión</h2>
      {sent ? (
        <div>Revisá tu email para ingresar al sistema.</div>
      ) : (
        <form onSubmit={handleLogin}>
          <label>
            Email:
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: "100%", margin: "8px 0 18px 0", padding: 8, borderRadius: 6, border: "1px solid #bbb" }}
            />
          </label>
          <button style={{ width: "100%", padding: 10, borderRadius: 6, background: "#e04545", color: "#fff", border: "none" }} disabled={loading}>
            {loading ? "Enviando..." : "Ingresar"}
          </button>
        </form>
      )}
    </div>
  );
}
