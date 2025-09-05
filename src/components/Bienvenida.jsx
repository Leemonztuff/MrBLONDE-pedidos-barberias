import React from "react";

export default function Bienvenida({ onComenzar }) {
  return (
    <div style={{
      maxWidth: 430, margin: "30px auto", background: "#fff",
      borderRadius: 12, boxShadow: "0 2px 20px #0002", padding: 28, textAlign: "center"
    }}>
      <img
        src="https://acdn-us.mitiendanube.com/stores/001/189/845/themes/common/logo-444226241-1724431587-bd5b136f0d1deff9293cc079c49fb07b1724431588-480-0.webp"
        alt="Mr Blonde"
        style={{ width: 130, marginBottom: 20 }}
      />
      <h1 style={{ color: "#e04545", fontWeight: "900" }}>¡Bienvenido!</h1>
      <p style={{ fontSize: 18, color: "#222", margin: "18px 0 9px" }}>
        Pedí productos oficiales Mr Blonde directo a fábrica.
      </p>
      <ol style={{ textAlign: "left", margin: "0 auto 20px", padding: "0 0 0 22px", color: "#444" }}>
        <li>Elegí tus productos</li>
        <li>Completá tus datos</li>
        <li>Enviá tu pedido</li>
      </ol>
      <button
        className="green"
        style={{
          width: "100%", fontSize: 19, padding: "13px 0",
          borderRadius: 8, background: "#e04545", color: "#fff",
          border: "none", fontWeight: 700, marginBottom: 16
        }}
        onClick={onComenzar}
      >
        ¡Comenzar pedido!
      </button>
      <a
        href="https://wa.me/5491122334455?text=Hola%20quiero%20hacer%20un%20pedido%20de%20Mr%20Blonde"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block", background: "#25d366",
          color: "#fff", borderRadius: 8, padding: "12px 32px",
          fontWeight: 600, textDecoration: "none",
          fontSize: 17, marginTop: 6
        }}
      >
        <span role="img" aria-label="WhatsApp">💬</span> Consultar por WhatsApp
      </a>
    </div>
  );
}
