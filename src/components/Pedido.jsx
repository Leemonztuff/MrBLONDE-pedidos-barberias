import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";
import productos from "../data/productos";
import UpsellModal from "./UpsellModal";

const LOCALIDADES = ["CABA", "Rosario", "Córdoba Capital", "Otra"];

export default function Pedido() {
  const [step, setStep] = useState(0);
  const [pedido, setPedido] = useState({});
  const [datos, setDatos] = useState({ nombre: "", email: "", telefono: "", localidad: "" });
  const [historial, setHistorial] = useState([]);
  const [upsellOpen, setUpsellOpen] = useState(false);

  // Cargar historial de pedidos por email (si se ingresó)
  useEffect(() => {
    if (datos.email) {
      supabase
        .from("orders")
        .select("*")
        .eq("email_cliente", datos.email)
        .order("created_at", { ascending: false })
        .then(({ data }) => setHistorial(data ?? []));
    }
  }, [datos.email]);

  function handleNext() {
    if (step === 0 && Object.values(pedido).every(q => q === 0 || q == null)) {
      alert("Agregá al menos un producto.");
      return;
    }
    if (step === 1 && (!datos.nombre || !datos.telefono || !datos.localidad)) {
      alert("Completá todos los datos.");
      return;
    }
    setStep(step + 1);
  }
  function handlePedidoChange(idx, qty) {
    setPedido({ ...pedido, [idx]: qty });
  }

  function calcularResumen() {
    let total = 0, productosSel = [];
    productos.forEach((p, i) => {
      const qty = Number(pedido[i] || 0);
      if (qty > 0) {
        total += qty * p.price;
        productosSel.push({
          nombre: p.name,
          cantidad: qty,
          bonus: calcularBonus(qty, p.bonus)
        });
      }
    });
    return { productos: productosSel, total };
  }

  function calcularBonus(qty, rule) {
    if (!rule) return 0;
    let bestBonus = 0;
    rule.split('/').forEach(r => {
      const [x, y] = r.match(/\d+/g).map(Number);
      const b = Math.floor(qty/x)*y;
      if(b > bestBonus) bestBonus = b;
    });
    return bestBonus;
  }

  function guardarPedido(finalPedido) {
    supabase.from("orders").insert([{
      nombre: datos.nombre,
      email_cliente: datos.email,
      telefono: datos.telefono,
      localidad: datos.localidad,
      productos: finalPedido.productos,
      total: finalPedido.total,
      created_at: new Date().toISOString()
    }])
    .then(() => {
      setPedido({});
      setDatos({ nombre: "", email: "", telefono: "", localidad: "" });
      setStep(0);
      alert("¡Gracias por tu pedido! Te contactamos por WhatsApp.");
    });
  }

  function enviarPedido() {
    setUpsellOpen(true);
  }
  function finalizarPedido(extra = []) {
    const resumen = calcularResumen();
    if (extra.length) {
      extra.forEach(prod => resumen.productos.push(prod));
      resumen.total += extra.reduce((sum, x) => sum + x.price, 0);
    }
    guardarPedido(resumen);
    setUpsellOpen(false);
  }

  return (
    <div style={{ maxWidth: 430, margin: "30px auto" }}>
      <h2>Hacé tu pedido</h2>
      <div style={{ margin: "16px 0" }}>
        <span style={{ color: "#888" }}>Paso {step+1} de 3</span>
      </div>
      {step === 0 && (
        <div>
          {productos.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", marginBottom: 15, background: "#fff", borderRadius: 8, boxShadow: "0 1px 8px #0001", padding: 12
            }}>
              <div style={{ flex: 1 }}>{p.name}</div>
              <div style={{ color: "#e04545", fontWeight: 700, fontSize: "1em", width: 100 }}>${p.price.toLocaleString('es-AR', {minimumFractionDigits:2})}</div>
              <input type="number" min={0} value={pedido[i] || ""} onChange={e => handlePedidoChange(i, Math.max(0, Number(e.target.value)))} style={{width: 50, marginLeft: 16, borderRadius: 6, border: "1px solid #ddd"}} />
              {pedido[i] > 0 && p.bonus && calcularBonus(pedido[i], p.bonus) > 0 && (
                <span className="bonus-badge" data-tooltip={`¡Promo ${p.bonus} aplicada!`} style={{ marginLeft: 8 }}>
                  (+{calcularBonus(pedido[i], p.bonus)})
                </span>
              )}
            </div>
          ))}
          <button className="green" style={{ width: "100%", marginTop: 18 }} onClick={handleNext}>Siguiente</button>
        </div>
      )}
      {step === 1 && (
        <div>
          <label>Tu nombre *</label>
          <input type="text" required value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })} style={{ width: "100%", marginBottom: 10, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
          <label>WhatsApp *</label>
          <input type="text" required value={datos.telefono} onChange={e => setDatos({ ...datos, telefono: e.target.value })} style={{ width: "100%", marginBottom: 10, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
          <label>Localidad *</label>
          <select value={datos.localidad} onChange={e => setDatos({ ...datos, localidad: e.target.value })} style={{ width: "100%", padding: 8, borderRadius: 6, marginBottom: 10 }}>
            <option value="">Selecciona tu localidad</option>
            {LOCALIDADES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>
          <label>Email (opcional, para historial)</label>
          <input type="email" value={datos.email} onChange={e => setDatos({ ...datos, email: e.target.value })} style={{ width: "100%", marginBottom: 14, padding: 8, borderRadius: 6, border: "1px solid #bbb" }} />
          <button className="grey" onClick={() => setStep(0)} style={{ marginRight: 6 }}>Atrás</button>
          <button className="green" onClick={handleNext}>Siguiente</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h4>Confirmá tu pedido</h4>
          <ul>
            {calcularResumen().productos.map((p, idx) => (
              <li key={idx}>{p.nombre}: {p.cantidad}{p.bonus ? ` (+${p.bonus})` : ""}</li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, color: "#e04545", fontSize: 18, margin: "10px 0" }}>
            Total: ${calcularResumen().total.toLocaleString('es-AR', {minimumFractionDigits:2})}
          </div>
          <button className="grey" onClick={() => setStep(1)} style={{ marginRight: 6 }}>Atrás</button>
          <button className="green" onClick={enviarPedido}>Enviar Pedido</button>
        </div>
      )}
      {upsellOpen && <UpsellModal onFinish={finalizarPedido} onCancel={() => setUpsellOpen(false)} />}
      <div style={{ marginTop: 34 }}>
        <h3>Historial de pedidos</h3>
        {datos.email ? (
          historial.length === 0 ? (
            <div style={{ color: "#aaa" }}>Sin pedidos anteriores.</div>
          ) : (
            <ul>
              {historial.map((p, i) => (
                <li key={i}>{new Date(p.created_at).toLocaleDateString()} — {p.productos.map(x => `${x.nombre} (${x.cantidad}${x.bonus ? `+${x.bonus}` : ""})`).join(", ")} — ${p.total.toLocaleString('es-AR')}</li>
              ))}
            </ul>
          )
        ) : (
          <div style={{ color: "#aaa" }}>Ingresá tu email para ver historial.</div>
        )}
      </div>
    </div>
  );
}