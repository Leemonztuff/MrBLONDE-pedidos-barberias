import React, { useState } from "react";

export default function ModalCantidad({ producto, onConfirm, onClose }) {
  const [cantidad, setCantidad] = useState("1");

  function handleNumClick(num) {
    if (cantidad === "0" && num === "0") return;
    if (cantidad === "0") setCantidad(num);
    else setCantidad(cantidad + num);
  }

  function handleBackspace() {
    if (cantidad.length === 1) setCantidad("1");
    else setCantidad(cantidad.slice(0, -1));
  }

  function handleConfirm() {
    const cant = Math.max(1, parseInt(cantidad));
    onConfirm(cant);
  }

  return (
    <div className="modal-ux-overlay">
      <div className="modal-ux-content" style={{ maxWidth: 340 }}>
        <h3>{producto?.name}</h3>
        <img
          src={producto?.img || "/placeholder.jpg"}
          alt={producto?.name}
          style={{ width: "100%", borderRadius: 10, marginBottom: 16 }}
        />
        <div style={{ marginBottom: 15, fontSize: 18, color: "#e04545", fontWeight: 700 }}>
          Precio: ${producto?.price}
        </div>
        <div style={{ fontSize: 35, fontWeight: 800, color: "#fff", letterSpacing: 2, marginBottom: 8, textAlign: "center" }}>
          {cantidad}
        </div>
        <div className="teclado-num">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button
              type="button"
              key={n}
              className="btn-num"
              onClick={() => handleNumClick(String(n))}
            >
              {n}
            </button>
          ))}
          <button type="button" className="btn-num btn-borrar" onClick={handleBackspace}>←</button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="green" onClick={handleConfirm}>Agregar</button>
          <button className="grey" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
