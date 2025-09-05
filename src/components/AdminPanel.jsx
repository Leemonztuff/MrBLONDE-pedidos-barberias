import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function AdminPanel({ user }) {
  const [orders, setOrders] = useState([]);
  const [clientes, setClientes] = useState([]);
  useEffect(() => {
    supabase.from("orders").select("*").order("created_at", {ascending:false}).then(({data}) => setOrders(data ?? []));
    supabase.from("users").select("*").then(({data}) => setClientes(data ?? []));
  }, []);

  return (
    <div style={{ maxWidth: 680, margin: "32px auto", background: "#fff", borderRadius: 12, boxShadow: "0 2px 12px #0001", padding: 32 }}>
      <h2>Panel de Administración</h2>
      <h3>Pedidos recientes</h3>
      <table style={{ width: "100%", fontSize: 15, marginBottom: 24 }}>
        <thead>
          <tr style={{ background: "#faf3f3" }}>
            <th>Fecha</th><th>Cliente</th><th>Teléfono</th><th>Localidad</th><th>Productos</th><th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={i}>
              <td>{new Date(o.created_at).toLocaleString()}</td>
              <td>{o.email}</td>
              <td>{o.telefono}</td>
              <td>{o.localidad}</td>
              <td>{o.productos.map(p => `${p.nombre} (${p.cantidad}${p.bonus ? `+${p.bonus}` : ""})`).join(", ")}</td>
              <td>${o.total.toLocaleString('es-AR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Clientes</h3>
      <ul>
        {clientes.map((c, i) => (
          <li key={i}>{c.email}</li>
        ))}
      </ul>
    </div>
  );
}
