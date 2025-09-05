import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Auth from "./components/Auth";
import Pedido from "./components/Pedido";
import AdminPanel from "./components/AdminPanel";
import Bienvenida from "./components/Bienvenida";

export default function App() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [startPedido, setStartPedido] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.email?.endsWith("@mrblonde.com.ar")) {
        setUser(user);
        setIsAdmin(true);
      }
      setChecking(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && session.user.email?.endsWith("@mrblonde.com.ar")) {
          setUser(session.user);
          setIsAdmin(true);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );
    return () => listener?.subscription.unsubscribe();
  }, []);

  if (checking) return <div>Cargando...</div>;
  if (isAdmin) return <AdminPanel user={user} />;
  if (!startPedido) return <Bienvenida onComenzar={() => setStartPedido(true)} />;
  return <Pedido onVolver={() => setStartPedido(false)} />;
}
