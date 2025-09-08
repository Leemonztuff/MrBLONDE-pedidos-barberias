import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Pedido from "./components/Pedido";
import Bienvenida from "./components/Bienvenida";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <React.Fragment>
            <Bienvenida />
          </React.Fragment>
        } />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}
