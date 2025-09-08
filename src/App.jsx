import React, { useState } from "react";
import Pedido from "./components/Pedido";
import Bienvenida from "./components/Bienvenida";
import "./index.css";

export default function App() {
  const [iniciar, setIniciar] = useState(false);

  return (
    <div>
      {!iniciar ? (
        <Bienvenida onComenzar={() => setIniciar(true)} />
      ) : (
        <Pedido onVolver={() => setIniciar(false)} />
      )}
    </div>
  );
}
