'use client';
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Header from "../dashboard/components/Header";

interface Rental {
  id: string;
  title: string;
  authors: string[];
  rentedAt: string;
}

const firebaseConfig = {
  apiKey: "AIzaSyAC2d52ypqETnYEwWAbEP7TWu_BHLx4Amc",
  authDomain: "bibliotech-ae2df.firebaseapp.com",
  projectId: "bibliotech-ae2df",
  storageBucket: "bibliotech-ae2df.firebasestorage.app",
  messagingSenderId: "279937033653",
  appId: "1:279937033653:web:559d80f82816af809065fc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export default function BibliotecaPage() {
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [user, setUser] = useState<User | null>(null);

  // Verificar se o usuário está logado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/"); // 🔥 Redireciona para login se não estiver autenticado
      } else {
        setUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  // Buscar livros alugados no Firestore
  useEffect(() => {
    const fetchRentals = async () => {
      const querySnapshot = await getDocs(collection(db, "rentals"));
      const rentalData: Rental[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        authors: doc.data().authors || [],
        rentedAt: doc.data().rentedAt || new Date().toISOString(),
      }));
      setRentals(rentalData);
    };
    fetchRentals();
  }, []);

  // Função para excluir um livro alugado
  const excluirDocumento = async (id: string) => {
    try {
      await deleteDoc(doc(db, "rentals", id));
      setRentals(rentals.filter(rental => rental.id !== id));
      alert("Livro removido com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir o documento:", error);
    }
  };

  if (!user) return <p>Carregando...</p>; // 🔄 Exibe "Carregando" enquanto verifica login

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen" 
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80')` }}>
      
      {/* ✅ Agora o Header recebe o usuário autenticado */}
      <Header user={user} currentPage='biblioteca'/>

      {/* Card centralizado */}
      <div className="p-6 max-w-4xl mx-auto">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">📚 Minha Biblioteca</h1>

          {/* Lista de Livros Alugados */}
          <div className="space-y-4">
            {rentals.length > 0 ? rentals.map((rental) => (
              <div key={rental.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
                <h2 className="text-xl font-semibold text-gray-800">{rental.title}</h2>
                <p className="text-sm text-gray-600">{rental.authors?.join(', ')}</p>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => excluirDocumento(rental.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-700 transition"
                  >
                    ❌ Excluir
                  </button>
                </div>
              </div>
            )) : (
              <p className="text-gray-600 text-center">Nenhum livro alugado no momento.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
