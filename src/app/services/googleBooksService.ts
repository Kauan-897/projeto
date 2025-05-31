export async function getBookById(bookId: string) {
  const API_URL = `https://www.googleapis.com/books/v1/volumes/${bookId}`;
  
  const response = await fetch(API_URL);
  
  if (!response.ok) {
    throw new Error("Erro ao buscar o livro");
  }

  return response.json();
}
