import React, { useState } from "react";
import productos from "../data/productos";
import ListaProductos from "./ListaProductos";

const LOCALIDADES = ["CABA", "Rosario", "Córdoba Capital", "Otra"];
const WHATSAPP_NUMBER = "5491122334455"; // Cambia por tu número real

export default function Pedido({ onVolver }) {
  const [step, setStep] = useState(0);
  const [pedido, setPedido] = useState({});
  const [datos, setDatos] = useState({ nombre: "", telefono: "", localidad: "", email: "" });
  const [whatsappLink, setWhatsappLink] = useState("#");

  function handleAgregarProducto(idx, cantidad) {
    setPedido(p => ({ ...p, [idx]: (p[idx] || 0) + cantidad }));
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
          price: p.price
        });
      }
    });
    return { productos: productosSel, total };
  }

  function handleNext() {
    if (step === 0 && Object.values(pedido).every(q => !q || q === 0)) {
      alert("Agrega al menos un producto.");
      return;
    }
    if (step === 1 && (!datos.nombre || !datos.telefono || !datos.localidad)) {
      alert("Completá todos los datos obligatorios.");
      return;
    }
    if (step === 2) {
      const resumen = calcularResumen();
      let msg = `¡Hola! Quiero pedir:\n`;
      resumen.productos.forEach(p => {
        msg += `• ${p.nombre}: ${p.cantidad}\n`;
      });
      msg += `Total: $${resumen.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}\n`;
      msg += `\nDatos:\nNombre: ${datos.nombre}\nWhatsApp: ${datos.telefono}\nLocalidad: ${datos.localidad}`;
      if (datos.email) msg += `\nEmail: ${datos.email}`;
      setWhatsappLink(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
    }
    setStep(s => s + 1);
  }

  function handleReset() {
    setStep(0);
    setPedido({});
    setDatos({ nombre: "", telefono: "", localidad: "", email: "" });
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
        <span style={{ color: "#fff", opacity: 0.8 }}>Paso {step + 1} de 3</span>
      </div>
      {step === 0 && (
        <>
          <ListaProductos onAgregar={handleAgregarProducto} pedido={pedido} />
          <button className="green" style={{ width: "100%", marginTop: 18 }} onClick={handleNext}>Siguiente</button>
          <button className="grey" style={{ width: "100%" }} onClick={onVolver}>Volver</button>
        </>
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
                <span role="img" aria-label="check">🧴</span> {p.nombre}: <b>{p.cantidad}</b>
              </li>
            ))}
          </ul>
          <div style={{ fontWeight: 700, color: "#e04545", fontSize: 22, margin: "10px 0" }}>
            Total: ${calcularResumen().total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
          </div>
          <p style={{ color: "#fff", fontSize: 15, margin: "20px 0 7px 0" }}>
            Al hacer clic en "Enviar por WhatsApp" se abrirá WhatsApp con el pedido prellenado. ¡No olvides presionar "Enviar"!
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="green"
            style={{ display: "block", textAlign: "center", textDecoration: "none", margin: "8px 0" }}
            onClick={handleReset}
          >
            💬 Enviar por WhatsApp
          </a>
          <button className="grey" style={{ width: "100%" }} onClick={() => setStep(1)}>Volver</button>
        </div>
      )}
    </div>
  );
}
