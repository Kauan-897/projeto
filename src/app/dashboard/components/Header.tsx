import { User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";

interface HeaderProps {
  user: User | null;
  currentPage: "dashboard" | "biblioteca"; // 🔥 Adicionando uma prop para identificar a página atual
}

export default function Header({ user, currentPage }: HeaderProps) {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
  try {
    await signOut(auth);
    alert("Logout realizado com sucesso!");
    router.push("/") // Redireciona para login
  } catch (error) {
    console.error("Erro ao sair:", error);
    alert("Erro ao sair da conta.");
  }
};

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
        <button 
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          onClick={handleLogout}
        >
          🚪 Sair
        </button>
      </nav>

      {/* Exibir nome do usuário SE estiver logado */}
      <span className="text-lg font-semibold">
        {user ? `👤 ${user.displayName ?? "Usuário"}` : "🔑 Não logado"}
      </span>
    </header>
  );
}
