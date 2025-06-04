import { getBookById } from "@/app/services/googleBooksService";
import RentButton from "./RentButton";
import NavigationButton from './NavigationButton';

interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[]; // 🔥 Agora authors pode ser undefined sem gerar erro!
    description?: string;
    imageLinks?: {
      thumbnail: string;
      large: string;
      extraLarge: string;
    };
  };
}


export default async function BookPage({ params }: { params: { id: string } }) {
  const book: Book = await getBookById(params.id);

  return (
    <div className="bg-cover bg-center bg-no-repeat min-h-screen flex justify-center items-center"
         style={{ backgroundImage: `url('https://images.unsplash.com/photo-1706250718869-677489d2691d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}>
      
      {/* Card do Livro */}
      <div className="p-6 bg-slate-50 shadow-lg rounded-lg max-w-lg w-full">
        {/* Imagem do Livro */}
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img src={book.volumeInfo.imageLinks?.extraLarge 
  ?? book.volumeInfo.imageLinks?.large 
  ?? book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title}
               className="w-full h-64 object-cover rounded-lg mb-4"/>
        )}

        {/* Título e autor(es) */}
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{book.volumeInfo.title}</h1>
        <h3 className="text-lg text-gray-600 mb-6">
          Autor(es): {book.volumeInfo.authors ?? ["Desconhecido"]}
        </h3>

        {/* Descrição do livro */}
        <div className="border p-4 rounded-lg bg-gray-100 text-gray-800">
          <p className="text-lg">{book.volumeInfo.description ?? "Sem descrição disponível."}</p>
        </div>

        {/* Botões */}
        <div className="flex justify-between items-center mt-6">
          <RentButton book={book} />
          <NavigationButton />
        </div>
      </div>
    </div>
  );
}
