export type Book = {
  id: number;
  titre: string;
  auteur: string;
  description: string;
  datePublication: string;
  isAvailable: boolean;
}

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  borrowedBooks: number[];
}

export const BOOKS: Book[] = [
  {
    id: 1,
    titre: "Le Petit Prince",
    auteur: "Antoine de Saint-Exupéry",
    description: "Le Petit Prince est une œuvre de langue française, la plus connue d'Antoine de Saint-Exupéry.",
    datePublication: "6 avril 1943",
    isAvailable: true
  },
  {
    id: 2,
    titre: "Le Seigneur des anneaux",
    auteur: "J.R.R. Tolkien",
    description: "Le Seigneur des anneaux est une trilogie romanesque de l'écrivain britannique J. R. R. Tolkien.",
    datePublication: "29 juillet 1954",
    isAvailable: true
  }
];

export const USERS: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
    isAdmin: true,
    borrowedBooks: []
  },
  {
    id: 2,
    name: 'Alice Lemerre',
    email: 'alice@mail.com',
    password: '1234',
    isAdmin: false,
    borrowedBooks: []
  }
];

// Authentication and data management functions
export const getData = async <T>(
  url: string,
  email: string,
  password: string
): Promise<T> => {
  // Simulate an API call by checking hardcoded users
  const user = USERS.find(
    u => u.email === email && u.password === password
  );

  if (user) {
    // Successful login - return user data
    return user as T;
  } else {
    // Failed login
    throw new Error('Invalid credentials');
  }
}

// Book management functions
export const addBook = (book: Omit<Book, 'id' | 'isAvailable'>): Book => {
  const newBook: Book = {
    id: BOOKS.length + 1,
    ...book,
    isAvailable: true
  };
  BOOKS.push(newBook);
  return newBook;
}

export const borrowBook = (userId: number, bookId: number): boolean => {
  const book = BOOKS.find(b => b.id === bookId);
  const user = USERS.find(u => u.id === userId);

  if (book && user && book.isAvailable) {
    book.isAvailable = false;
    user.borrowedBooks.push(bookId);
    return true;
  }
  return false;
}

export const returnBook = (userId: number, bookId: number): boolean => {
  const book = BOOKS.find(b => b.id === bookId);
  const user = USERS.find(u => u.id === userId);

  if (book && user) {
    const bookIndex = user.borrowedBooks.indexOf(bookId);
    if (bookIndex > -1) {
      book.isAvailable = true;
      user.borrowedBooks.splice(bookIndex, 1);
      return true;
    }
  }
  return false;
}

export const removeBook = (bookId: number): boolean => {
  const index = BOOKS.findIndex(b => b.id === bookId);
  if (index > -1) {
    BOOKS.splice(index, 1);
    return true;
  }
  return false;
}

export const updateBook = (bookId: number, updatedBook: Partial<Book>): Book | null => {
  const index = BOOKS.findIndex(b => b.id === bookId);
  if (index > -1) {
    BOOKS[index] = { ...BOOKS[index], ...updatedBook };
    return BOOKS[index];
  }
  return null;
}