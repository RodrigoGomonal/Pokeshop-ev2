// src/components/pages/Admin/Home.js
import React, { useEffect, useState } from "react";
import AdminLayout from "../../templates/AdminLayout";
import AdHomeSection from "../../organisms/AdHomeSection";

export default function Home() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    if (usuarioActivo && usuarioActivo.tipo_usuario === 1) {
      setUsuario(usuarioActivo);
    } else {
      window.location.href = "/Login";
    }
  }, []);

  return (
    <AdminLayout>
      <AdHomeSection nombre={usuario?.nombre} />
    </AdminLayout>
  );
}
