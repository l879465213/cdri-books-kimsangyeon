import { useLocalStorage } from "@/shared/hooks/useLocalStorage";
import type { BookResponse } from "@/features/book/types";

const SAVED_BOOKS_KEY = "savedBooks";

export const useSavedBooks = () => {
  const [savedBooks, setSavedBooks] = useLocalStorage<BookResponse[]>(SAVED_BOOKS_KEY, []);

  const isBookSaved = (isbn: string) => {
    return savedBooks.some((book) => book.isbn === isbn);
  };

  const toggleSaveBook = (book: BookResponse) => {
    setSavedBooks((prev) => {
      const isSaved = prev.some((b) => b.isbn === book.isbn);
      if (isSaved) {
        return prev.filter((b) => b.isbn !== book.isbn);
      } else {
        return [...prev, book];
      }
    });
  };

  const removeSavedBook = (isbn: string) => {
    setSavedBooks((prev) => prev.filter((b) => b.isbn !== isbn));
  };

  return {
    savedBooks,
    isBookSaved,
    toggleSaveBook,
    removeSavedBook,
  };
};

