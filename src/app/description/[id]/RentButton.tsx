"use client";

import { addDoc, collection, getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

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
const db = getFirestore(app);

interface RentButtonProps {
  book: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[]; // ✅ Agora authors pode ser undefined
    };
  };
}

export default function RentButton({ book }: RentButtonProps) {
  const rentBook = async () => {
    try {
      await addDoc(collection(db, "rentals"), {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors ?? ["Desconhecido"], // ✅ Garantimos um fallback
        rentedAt: new Date().toISOString(),
      });
      alert("📚 Livro alugado com sucesso!");
    } catch (error) {
      console.error("Erro ao alugar livro:", error);
      alert("⚠️ Erro ao alugar livro.");
    }
  };

  return (
    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition" onClick={rentBook}>
      📕 Alugar
    </button>
  );
}
