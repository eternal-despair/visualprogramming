import { useEffect, useState } from 'react';
import { BookCard } from './BookCard';
import './App.css';

// Тип данных из первого API
interface Book {
  id: number;
  title: string;
  isbn: string;
  pageCount: number;
  authors: string[];
}

interface BookWithCover extends Book {
  coverBlobUrl: string | null;
}

function App() {
  const [books, setBooks] = useState<BookWithCover[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooksAndCovers = async () => {
      try {
        const response = await fetch('https://fakeapi.extendsclass.com/books');
        
        if (!response.ok) throw new Error('API книг недоступен');
        const booksData: Book[] = await response.json();

        const booksWithBlobs = await Promise.all(
          booksData.map(async (book) => {
            let coverBlobUrl = null;

            if (book.isbn) {
              try {
                const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
                const googleData = await googleRes.json();
                
                let thumbnailUrl = googleData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail;

                if (thumbnailUrl) {
                  thumbnailUrl = thumbnailUrl.replace('http:', 'https:');
                  
                  // СКАЧИВАЕМ КАРТИНКУ КАК BLOB (набор байт)
                  const imageRes = await fetch(thumbnailUrl);
                  const imageBlob = await imageRes.blob(); 
                  
                  coverBlobUrl = URL.createObjectURL(imageBlob);
                }
              } catch (err) {
                console.error(`Не удалось загрузить обложку для ISBN ${book.isbn}`, err);
              }
            }

            return { ...book, coverBlobUrl };
          })
        );

        setBooks(booksWithBlobs);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooksAndCovers();
  }, []);

  if (loading) {
    return <h2>Загрузка книг...</h2>;
  }

  return (
    <div className="book-grid">
      {books.length === 0 ? <p>Книги не найдены</p> : null}
      
      {books.map((book) => (
        <BookCard
          key={book.id}
          title={book.title}
          authors={book.authors}
          coverBlobUrl={book.coverBlobUrl} // Передаем BLOB-ссылку
        />
      ))}
    </div>
  );
}

export default App;