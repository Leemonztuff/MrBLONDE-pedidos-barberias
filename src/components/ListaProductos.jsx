import React, { useState } from "react";
import productos from "../data/productos";
import ModalCantidad from "./ModalCantidad";

export default function ListaProductos({ onAgregar, pedido }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [prodSeleccionado, setProdSeleccionado] = useState(null);

  function handleCardClick(producto, idx) {
    setProdSeleccionado({ ...producto, idx });
    setModalOpen(true);
  }

  function handleCantidadConfirm(cantidad) {
    if (prodSeleccionado && cantidad > 0) {
      onAgregar(prodSeleccionado.idx, cantidad);
    }
    setModalOpen(false);
    setProdSeleccionado(null);
  }

  return (
    <div>
      <div className="grid-productos">
        {productos.map((p, i) => (
          <div
            key={i}
            className="card-producto"
            style={{ backgroundImage: `url(${p.img || "/placeholder.jpg"})` }}
            onClick={() => handleCardClick(p, i)}
          >
            <div className="precio-pill">${p.price}</div>
            <div className="degrade-bottom">
              <span className="nombre-prod">{p.name}</span>
              {pedido[i] ? (
                <span className="cantidad-pill">x{pedido[i]}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <ModalCantidad
          producto={prodSeleccionado}
          onConfirm={handleCantidadConfirm}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
