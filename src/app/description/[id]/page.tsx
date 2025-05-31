'use server';
import { addDoc, collection } from "firebase/firestore";
import { getBookById } from "../../services/googleBooksService";
import { db } from "../../page";

interface Book {
    id: string;
  volumeInfo: {
    title: string;
    description: string;
    authors: string[];
  };
}

export default async function BookPage({ params }: { params: { id: string } }) {
  const book: Book = await getBookById(params.id);
  return (
    <>
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Título: {book.volumeInfo.title}</h1>
      <h3 className="text-2xl mb-10">Autor(es): {book.volumeInfo.authors?.join(", ") ?? "Desconhecido"}</h3>
      <div className="border p-4 rounded shadow">
        <p className="text-lg ">{book.volumeInfo.description ?? "Sem descrição disponível."}</p>
      </div>
    </div>
    </>
    
  );
}
