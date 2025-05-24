'use client'
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc} from 'firebase/firestore';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Book {
  id: any;
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

type User = {
  id: string;
  name: string;
  email: string;
};

const firebaseConfig = {
  apiKey: "AIzaSyBvr6WRs3z58fawImNXMkJqX1FVtgMBayM",
  authDomain: "bibliotech-bdb59.firebaseapp.com",
  projectId: "bibliotech-bdb59",
  storageBucket: "bibliotech-bdb59.firebasestorage.app",
  messagingSenderId: "359625955788",
  appId: "1:359625955788:web:35c48ceb551ec76d77a569"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState<string>('');
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    const fetchRentals = async () => {
      const querySnapshot = await getDocs(collection(db, 'rentals'));
      const rentalData: Rental[] = querySnapshot.docs.map(doc => doc.data() as Rental);
      setRentals(rentalData);
    };
    fetchRentals();
  }, []);

  const searchBooks = async () => {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`);
    setBooks(response.data.items || []);
  };

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

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch('/api/users')
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Biblioteca Virtual</h1>
      <div className="">
        <div className='mb-4 flex gap-2'>
           <input
          className="border p-2 flex-grow"
          type="text"
          placeholder="Buscar livro"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={searchBooks}
        >
          Buscar
        </button>
        <button className="bg-sky-400 text-white px-4 py-2 rounded" type="button" onClick={() => router.push('/dashboard')}>
          Dashboard
        </button>
        </div>
       
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <div key={book.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{book.volumeInfo.title}</h2>
            <p className="text-sm">{book.volumeInfo.authors?.join(', ')}</p>
            <button
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
              onClick={() => rentBook(book)}
            >
              Alugar
            </button>
          </div>
        ))}
      </div>
    </div>
 </div>
    </>
  );
}
   