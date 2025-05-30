'use client'
import { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

interface Rental {
  id: string;
  title: string;
  authors: string[];
  rentedAt: string;
}

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

export default function dashboard() {
  const router = useRouter();
  const [rentals, setRentals] = useState<Rental[]>([]);

 useEffect(() => {
  const fetchRentals = async () => {
    const querySnapshot = await getDocs(collection(db, "rentals"));
    const rentalData: Rental[] = querySnapshot.docs.map(doc => ({
      id: doc.id, // Adicionando o ID do documento
      title: doc.data().title,
      authors: doc.data().authors || [],
      rentedAt: doc.data().rentedAt || new Date().toISOString(),
    }) as Rental);
    setRentals(rentalData);
  };
  fetchRentals();
  
}, []);


  async function excluirDocumento(colecao: string, id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, colecao, id));
    console.log(`Documento com ID ${id} excluído com sucesso!`);
    alert('Documento excluído com sucesso!');
  } catch (error) {
    console.error("Erro ao excluir o documento:", error);
  }
}


  return(
    <div>
        <button className="bg-sky-400 text-white px-4 py-2 rounded mb-4" type="button" onClick={() => router.push('/')}>
          Home
        </button>
        <h1 className='text-2xl'>Meus Livros</h1>
        <div className='bg-neutral-50 text-black w-3xs p-2 ms-16 rounded'>{rentals.map((rental) => (
           <div key={rental.id} className='border-b-2 border-neutral-300'>
            <ul className='py-4'>
              <li key={rental.id}>{rental.title} ({rental.authors})</li>
              <button
              onClick={() => excluirDocumento('rentals', rental.id)} 
              type='submit'
              className="mt-2 bg-green-500 text-white px-4 py-1 rounded"
            >
              Excluir
            </button>
            </ul>
          </div>
        ))}</div>
    </div>
  )
}

