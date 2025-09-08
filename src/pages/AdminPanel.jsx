import React, { useState, useEffect } from "react";
import { supabase } from "../supabase";

export default function AdminPanel() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductos();
  }, []);

  async function getProductos() {
    const { data, error } = await supabase.from("productos").select("*").order("id", { ascending: false });
    setProductos(data || []);
  }

  // Scraping usando fetch del frontend: asume que CORS está permitido o usas un proxy
  async function handleAgregar(e) {
    e.preventDefault();
    setError("");
    if (!url.trim()) return setError("Pega el link del producto.");

    setLoading(true);
    try {
      // CORS: si da error, usar un proxy público como https://api.allorigins.win/raw?url=
      const resp = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const html = await resp.text();
      // Extraer datos básicos usando DOMParser
      const doc = new window.DOMParser().parseFromString(html, "text/html");
      // Ajusta los selectores según tu tienda
      const name = doc.querySelector("h1")?.innerText || "sin nombre";
      const priceText = doc.querySelector('[class*=price], [class*=Price]')?.innerText || "0";
      const img = doc.querySelector("img[src*='product'], img[src*='products']")?.src || "";

      // Limpieza de precio
      const price = parseFloat((priceText.match(/[\d\.,]+/)||["0"])[0].replace(/\./g,"").replace(",","."));

      // Guardar en Supabase
      const { error: insertError } = await supabase.from("productos").insert([
        { name, price, img, url }
      ]);
      if (insertError) throw new Error(insertError.message);

      setUrl("");
      await getProductos();
    } catch (err) {
      setError("No se pudo agregar el producto: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="form-container" style={{maxWidth:540}}>
      <h2 className="form-title">Panel de Admin</h2>
      <form onSubmit={handleAgregar} style={{marginBottom:18}}>
        <input
          type="url"
          value={url}
          onChange={e=>setUrl(e.target.value)}
          placeholder="Pega el link completo del producto"
          required
        />
        <button className="green" type="submit" disabled={loading}>
          {loading ? "Agregando..." : "Agregar producto"}
        </button>
      </form>
      {error && <div style={{color:"red", marginBottom:10}}>{error}</div>}
      <h3 style={{color:"#d4af37",margin:"20px 0 10px"}}>Productos cargados</h3>
      <div style={{display:"flex", flexWrap:"wrap", gap:18}}>
        {productos.map(p =>
          <div key={p.id} style={{
            background:"#23211c",padding:14,borderRadius:12,maxWidth:180,minWidth:160,
            color:"#fff",boxShadow:"0 2px 10px #0005"
          }}>
            <div style={{fontWeight:700,minHeight:36,marginBottom:8,fontSize:15}}>{p.name}</div>
            {p.img && <img src={p.img} alt={p.name} style={{width:"100%",borderRadius:8,marginBottom:6}} />}
            <div style={{color:"#d4af37",fontWeight:700,marginBottom:4}}>Precio: ${p.price}</div>
            <a href={p.url} target="_blank" rel="noopener noreferrer" style={{color:"#25d366",fontSize:13}}>Ver producto</a>
          </div>
        )}
      </div>
    </div>
  );
}
