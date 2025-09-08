import React, { useState } from "react";

export default function ModalCantidad({ producto, onConfirm, onClose }) {
  const [cantidad, setCantidad] = useState(1);
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
        <input
          type="number"
          min={1}
          value={cantidad}
          onChange={e => setCantidad(Math.max(1, Number(e.target.value)))}
          style={{ width: "100%", fontSize: 20, textAlign: "center" }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button className="green" onClick={() => onConfirm(cantidad)}>Agregar</button>
          <button className="grey" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
