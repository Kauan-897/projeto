'use client';
import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";

const firebaseConfig = {
  apiKey: "AIzaSyAC2d52ypqETnYEwWAbEP7TWu_BHLx4Amc",
  authDomain: "bibliotech-ae2df.firebaseapp.com",
  projectId: "bibliotech-ae2df",
  storageBucket: "bibliotech-ae2df.firebasestorage.app",
  messagingSenderId: "279937033653",
  appId: "1:279937033653:web:559d80f82816af809065fc"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); 
    } catch (error: any) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });

      alert("Cadastro realizado com sucesso! Faça login.");
    } catch (error: any) {
      setError("Erro ao cadastrar. Verifique os dados inseridos.");
    }
  };

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen flex justify-center items-center"
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80')` }}>
      
      {/* Card centralizado */}
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">🔑 Acesse sua conta</h1>

        {/* Mensagem de erro */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Campos de entrada */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nome"
            className="border p-2 w-full rounded-lg bg-gray-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="border p-2 w-full rounded-lg bg-gray-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="border p-2 w-full rounded-lg bg-gray-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Botões */}
        <div className="space-y-2 mt-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-800 transition"
            onClick={handleLogin}
          >
            Entrar
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg w-full hover:bg-green-800 transition"
            onClick={handleRegister}
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}
