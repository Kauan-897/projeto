"use client"; // Precisa ser um componente client-side

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error, reset: () => void }) {
  useEffect(() => {
    console.error("Erro detectado:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">500</h1>
      <p className="text-xl text-gray-700 mt-4">Erro interno no servidor!</p>
      <button 
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={() => reset()} // Tenta recarregar a página
      >
        🔄 Tentar novamente
      </button>
    </div>
  );
}
