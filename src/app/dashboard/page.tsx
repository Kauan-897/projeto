"use client";
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import Header from './components/Header';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
  };
}

interface Rental {
  id: number;
  title: string;
  authors: string[];
  rentedAt: string;
}

type Users = {
  id: string;
  name: string;
  email: string;
};

const firebaseConfig = {
  apiKey: "AIzaSyAC2d52ypqETnYEwWAbEP7TWu_BHLx4Amc",
  authDomain: "bibliotech-ae2df.firebaseapp.com",
  projectId: "bibliotech-ae2df",
  storageBucket: "bibliotech-ae2df.firebasestorage.app",
  messagingSenderId: "279937033653",
  appId: "1:279937033653:web:559d80f82816af809065fc"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default function LibraryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState<string>(searchParams.get("q") || '');
  const [rentals, setRentals] = useState<Rental[]>([]);
  const auth = getAuth();
  const [login, setLogin] = useState<User | null>(null);
  const [users, setUsers] = useState<Users[]>([]);
  
  useEffect(() => {
    const fetchRentals = async () => {
      const querySnapshot = await getDocs(collection(db, 'rentals'));
      const rentalData: Rental[] = querySnapshot.docs.map(doc => doc.data() as Rental);
      setRentals(rentalData);
    };
    fetchRentals();
  }, []);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.push("/login"); 
    } else {
      setLogin(user);
    }
  });

  return () => unsubscribe(); 
}, [auth, router]);

  const searchBooks = async () => {
  const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`);
  console.log(response.data.items)
  setBooks(response.data.items || []);

  router.push(`?q=${search}`, { scroll: false }); 
};

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      searchBooks();
      event.preventDefault(); 
    }

  }

  const rentBook = async (book: Book) => {
    try {
      await addDoc(collection(db, 'rentals'), {
        id: book.id,
        title: book.volumeInfo.title,
        authors: book.volumeInfo.authors || [],
        rentedAt: new Date().toISOString(),
      });
      alert('Livro alugado com sucesso!');
    } catch (error) {
      console.error('Erro ao alugar livro:', error);
      alert('Erro ao alugar livro.');
    }
  };

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <div className='bg-cover bg-center bg-no-repeat min-h-screen' style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1600&q=80')` }}>
        <div className="p-6 max-w-4xl mx-auto">
        <Header user={login} currentPage="dashboard"/>

      {/* Biblioteca Virtual */}
      <h1 className="text-4xl font-bold mt-6 text-center text-white">Biblioteca Virtual</h1>

      {/* Barra de pesquisa */}
      <div className="flex gap-4 mt-6">
        <input
          className="border p-2 flex-grow rounded-lg bg-amber-50"
          type="text"
          placeholder="Buscar livro"
          value={search}
          onKeyDown={handleKeyDown}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition">
          🔍 Buscar
        </button>
        
      </div>

      {/* Grid de Livros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded-lg shadow-lg bg-white">
            <h2 className="text-xl font-semibold text-gray-900">{book.volumeInfo.title}</h2>
            <p className="text-sm text-gray-600">{book.volumeInfo.authors?.join(', ')}</p>
            <div className="flex justify-between items-center mt-4">
              <button className="bg-green-500 text-white px-4 py-1 rounded-lg hover:bg-green-700 transition"
                onClick={() => rentBook(book)}>
                📕 Alugar
              </button>
              <button className="bg-yellow-500 text-white px-4 py-1 rounded-lg hover:bg-yellow-700 transition"
                onClick={() => router.push('/description/' + book.id)}>
                📖 Descrição
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}