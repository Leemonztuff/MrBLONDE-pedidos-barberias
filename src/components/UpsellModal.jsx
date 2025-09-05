import React, { useState } from "react";

const UPSELL = [
  { name: "Shampoo Mini Viaje 60ml", price: 3590, desc: "Ideal para sumar y llegar a envío gratis" },
  { name: "Peine Profesional Mr Blonde", price: 2190, desc: "¡Llevá 2x1 en peines!" },
  { name: "Combo Barba (Aceite + Bálsamo)", price: 16900, desc: "¡Precio especial por combo!" },
  { name: "Bolso Neceser Mr Blonde", price: 5190, desc: "Perfecto para llevar tus productos" }
];

export default function UpsellModal({ onFinish, onCancel }) {
  const [seleccionados, setSeleccionados] = useState([]);
  function toggle(idx) {
    if (seleccionados.includes(idx))
      setSeleccionados(seleccionados.filter(i => i !== idx));
    else
      setSeleccionados([...seleccionados, idx]);
  }
  return (
    <div className="modal-bg" style={{ display: "block" }}>
      <div className="modal-content">
        <span className="modal-close" onClick={onCancel}>&times;</span>
        <div className="modal-header">¡Antes de finalizar!</div>
        <div style={{ marginBottom: 10, color: "#888" }}>¿Querés sumar alguno de estos productos destacados?</div>
        <div className="upsell-products">
          {UPSELL.map((prod, idx) => (
            <div key={idx} className="upsell-card" style={{ border: seleccionados.includes(idx) ? "2px solid #e04545" : "" }}>
              <span>
                <span className="upsell-title">{prod.name}</span><br />
                <span style={{ fontSize: "0.93em", color: "#888" }}>{prod.desc}</span>
              </span>
              <span className="upsell-price">${prod.price.toLocaleString('es-AR')}</span>
              <button className={seleccionados.includes(idx) ? "green" : ""} onClick={() => toggle(idx)}>
                {seleccionados.includes(idx) ? "Quitar" : "Agregar"}
              </button>
            </div>
          ))}
        </div>
        <button className="green" style={{ marginTop: 22 }} onClick={() =>
          onFinish(seleccionados.map(i => UPSELL[i]))
        }>Finalizar Pedido</button>
      </div>
    </div>
  );
}
