import React, { useState } from "react";
import { supabase } from "../supabase";
import productos from "../data/productos";
import UpsellModal from "./UpsellModal";
import confetti from "canvas-confetti";

const LOCALIDADES = ["CABA", "Rosario", "Córdoba Capital", "Otra"];
const WHATSAPP_NUMBER = "5491122334455"; // Cambia por tu número real

export default function Pedido({ onVolver }) {
  const [step, setStep] = useState(0);
  const [pedido, setPedido] = useState({});
  const [datos, setDatos] = useState({ nombre: "", email: "", telefono: "", localidad: "" });
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("#");

  function handleNext() {
    if (step === 0 && Object.values(pedido).every(q => q === 0 || q == null)) {
      alert("⚠️ Agregá al menos un producto antes de avanzar.");
      return;
    }
    if (step === 1 && (!datos.nombre || !datos.telefono || !datos.localidad)) {
      alert("⚠️ Completá todos los datos obligatorios.");
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

  function generarMensajeWhatsApp(resumen) {
    let msg = `¡Hola! Quiero pedir:\n`;
    resumen.productos.forEach(p => {
      msg += `• ${p.nombre}: ${p.cantidad}${p.bonus ? ` (+${p.bonus})` : ""}\n`;
    });
    msg += `Total: $${resumen.total.toLocaleString("es-AR", {minimumFractionDigits:2})}\n`;
    msg += `\nDatos:\nNombre: ${datos.nombre}\nWhatsApp: ${datos.telefono}\nLocalidad: ${datos.localidad}`;
    if (datos.email) msg += `\nEmail: ${datos.email}`;
    return encodeURIComponent(msg);
  }

  function guardarPedido(finalPedido) {
    setCargando(true);
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
      setCargando(false);
      setPedidoEnviado(true);
      const link = `https://wa.me/${WHATSAPP_NUMBER}?text=${generarMensajeWhatsApp(finalPedido)}`;
      setWhatsappLink(link);
      confetti({particleCount: 100, spread: 70, origin: { y: 0.6 }});
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

  if (pedidoEnviado) {
    return (
      <div className="form-container">
        <img
          className="form-logo"
          src="https://acdn-us.mitiendanube.com/stores/001/189/845/themes/common/logo-444226241-1724431587-bd5b136f0d1deff9293cc079c49fb07b1724431588-480-0.webp"
          alt="Mr Blonde"
        />
        <h2 style={{ color: "#e04545" }}>¡Gracias por tu pedido! 🎉</h2>
        <p style={{ color: "#fff" }}>Te contactamos pronto por WhatsApp.</p>
        <a
          href={whatsappLink}
          target="_blank" rel="noopener noreferrer"
          style={{
            display: "inline-block", marginTop: 24, color: "#fff", background: "#25d366",
            borderRadius: 8, padding: "13px 32px", fontSize: 19, fontWeight: 700, textDecoration: "none"
          }}
        >
          <span role="img" aria-label="WhatsApp">💬</span> Consultar por WhatsApp
        </a>
        <br />
        <button className="green" style={{ margin: "28px 0" }} onClick={onVolver}>
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <img
        className="form-logo"
        src="https://acdn-us.mitiendanube.com/stores/001/189/845/themes/common/logo-444226241-1724431587-bd5b136f0d1deff9293cc079c49fb07b1724431588-480-0.webp"
        alt="Mr Blonde"
      />
      <div className="form-title">Nuevo pedido</div>
      <div style={{ margin: "12px 0 18px 0", textAlign: "center" }}>
        <span style={{ color: "#fff", opacity: 0.8 }}>Paso {step+1} de 3</span>
      </div>
      {step === 0 && (
        <div>
          {productos.map((p, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", marginBottom: 15, background: "#23211c", borderRadius: 8, boxShadow: "0 1px 8px #0002", padding: 11
            }}>
              <div style={{ flex: 1, color: "#fff", fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: "#e04545", fontWeight: 700, fontSize: "1em", width: 100 }}>${p.price.toLocaleString('es-AR', {minimumFractionDigits:2})}</div>
              <input type="number" min={0} value={pedido[i] || ""} onChange={e => handlePedidoChange(i, Math.max(0, Number(e.target.value)))} style={{width: 50, marginLeft: 16, borderRadius: 6, border: "1px solid #d4af37", background: "#181818", color: "#fff"}} />
              {pedido[i] > 0 && p.bonus && calcularBonus(pedido[i], p.bonus) > 0 && (
                <span className="bonus-badge" data-tooltip={`¡Promo ${p.bonus} aplicada!`} style={{ marginLeft: 8, color: "#d4af37", fontWeight: 700 }}>
                  (+{calcularBonus(pedido[i], p.bonus)})
                </span>
              )}
            </div>
          ))}
          <button className="green" style={{ width: "100%", marginTop: 18 }} onClick={handleNext}>Siguiente</button>
        </div>
      )}
      {step === 1 && (
        <form onSubmit={e => { e.preventDefault(); handleNext(); }}>
          <label htmlFor="nombre">Tu nombre *</label>
          <input id="nombre" type="text" required value={datos.nombre} onChange={e => setDatos({ ...datos, nombre: e.target.value })} />

          <label htmlFor="telefono">WhatsApp *</label>
          <input id="telefono" type="text" required value={datos.telefono} onChange={e => setDatos({ ...datos, telefono: e.target.value })} />

          <label htmlFor="localidad">Localidad *</label>
          <select id="localidad" required value={datos.localidad} onChange={e => setDatos({ ...datos, localidad: e.target.value })}>
            <option value="">Selecciona tu localidad</option>
            {LOCALIDADES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <label htmlFor="email">Email (opcional, para historial)</label>
          <input id="email" type="email" value={datos.email} onChange={e => setDatos({ ...datos, email: e.target.value })} />

          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="grey" onClick={() => setStep(0)}>Atrás</button>
            <button type="submit" className="green">Siguiente</button>
          </div>
        </form>
      )}
      {step === 2 && (
        <div>
          <h4 style={{ color: "#e04545", marginBottom: 12 }}>Confirmá tu pedido</h4>
          <ul style={{ fontSize: 17, margin: "14px 0 10px 0", color: "#fff" }}>
            {calcularResumen().productos.map((p, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                <span role="img" aria-label="check">🧴</span> {p.nombre}: <b>{p.cantidad}{p.bonus ? ` (+${p.bonus})` : ""}</b>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, color: "#e04545", fontSize: 22, margin: "10px 0" }}>
            Total: ${calcularResumen().total.toLocaleString('es-AR', {minimumFractionDigits:2})}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="grey" onClick={() => setStep(1)}>Atrás</button>
            <button className="green" onClick={enviarPedido} disabled={cargando}>
              {cargando ? "Enviando..." : "Enviar Pedido"}
            </button>
          </div>
        </div>
      )}
      {upsellOpen && <UpsellModal onFinish={finalizarPedido} onCancel={() => setUpsellOpen(false)} />}
    </div>
  );
}
