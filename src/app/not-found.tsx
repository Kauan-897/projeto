export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-700 mt-4">Oops! Página não encontrada.</p>
      <button 
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        onClick={() => window.location.href = "/"}
      >
        🔙 Voltar para Home
      </button>
    </div>
  );
}
