import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

interface HeaderProps {
  user: User | null;
  currentPage: "dashboard" | "biblioteca"; // 🔥 Adicionando uma prop para identificar a página atual
}

export default function Header({ user, currentPage }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-blue-900 text-white p-4 flex justify-between items-center shadow-lg">
      {/* Título */}
      <h1 className="text-2xl font-bold flex items-center gap-2">
        📚 BiblioTECH
      </h1>

      {/* Navegação com botão dinâmico */}
      <nav className="flex gap-4">
        {currentPage === "biblioteca" ? (
          <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 hover:text-white transition"
            onClick={() => router.push("/dashboard")}>
            🏠 Ir para Dashboard
          </button>
        ) : (
          <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 hover:text-white transition"
            onClick={() => router.push("/biblioteca")}>
            📚 Minha Biblioteca
          </button>
        )}

        <button className="bg-white text-blue-900 px-4 py-2 rounded-md font-semibold hover:bg-blue-700 hover:text-white transition"
          onClick={() => router.push("/")}>
          🔑 Login
        </button>
      </nav>

      {/* Exibir nome do usuário SE estiver logado */}
      <span className="text-lg font-semibold">
        {user ? `👤 ${user.displayName ?? "Usuário"}` : "🔑 Não logado"}
      </span>
    </header>
  );
}
