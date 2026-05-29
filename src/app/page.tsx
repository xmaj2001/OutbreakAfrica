"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Chamas a tua rota local. Ninguém vê o appname!
    fetch("/api/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Bloqueado ou erro no servidor");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>Erro ao carregar dados: {error}</p>;
  if (!data) return <p>A carregar dados de forma segura...</p>;

  return (
    <div>
      <h1>Dados Protegidos</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
