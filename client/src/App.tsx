import React, { useState, ChangeEvent, FormEvent } from "react";
import { ReactComponent as Logo } from "./logo.svg";
import { 
  getData, 
  BOOKS, 
  Book, 
  User, 
  borrowBook, 
  returnBook, 
  removeBook, 
  updateBook 
} from "./utils/data-utils";
import FormInput from './components/form-input/form-input';
import AddBookForm from './components/add-book-form';

import './App.css';

const defaultFormFields = {
  email: '',
  password: '',
}

const App = () => {
  const [user, setUser] = useState<User | null>(null)
  const [formFields, setFormFields] = useState(defaultFormFields)
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<Book[]>(BOOKS)
  const [showAddBookForm, setShowAddBookForm] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const { email, password } = formFields

  const resetFormFields = () => {
    setFormFields(defaultFormFields)
    setError(null)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormFields({...formFields, [name]: value })
    setError(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    try {
      const res:User = await getData(
        'http://localhost:8000/login', email, password
      )
      setUser(res);
      resetFormFields()
    } catch (error) {
      setError('Invalid email or password')
    }
  };

  const reload = () => {
    setUser(null);
    resetFormFields()
  };

  const handleBorrowBook = (bookId: number) => {
    if (user && borrowBook(user.id, bookId)) {
      setBooks([...BOOKS]);
    }
  };

  const handleReturnBook = (bookId: number) => {
    if (user && returnBook(user.id, bookId)) {
      setBooks([...BOOKS]);
    }
  };

  const handleRemoveBook = (bookId: number) => {
    if (removeBook(bookId)) {
      setBooks(BOOKS);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
  };

  const handleUpdateBook = (updatedBook: Partial<Book>) => {
    if (editingBook) {
      const updated = updateBook(editingBook.id, updatedBook);
      if (updated) {
        setBooks([...BOOKS]);
        setEditingBook(null);
      }
    }
  };

  const handleAddBook = () => {
    setBooks([...BOOKS]);
    setShowAddBookForm(false);
  };

  const userBorrowedBooks = user 
    ? books.filter(book => user.borrowedBooks.includes(book.id)) 
    : [];

  return (
    <div className='App-header'>
      {user ? (
        <div className="user-dashboard">
          <h1>Vous être connecté en tant que {user.name}</h1>
          <button onClick={reload}>Se déconnecter</button>

          {user.isAdmin ? (
            <div className="admin-section">
              <h2>Tableau de bord</h2>
              <button onClick={() => setShowAddBookForm(!showAddBookForm)}>
                {showAddBookForm ? 'Annuler' : 'Ajouter un Livre'}
              </button>
              
              {showAddBookForm && (
                <AddBookForm onBookAdded={handleAddBook} />
              )}
            </div>
          ) : (
            <div className="borrowed-books">
              <h2>Livres Empruntés</h2>
              {userBorrowedBooks.length === 0 ? (
                <p>Aucun livre emprunté</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Titre</th>
                      <th>Auteur</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userBorrowedBooks.map((book) => (
                      <tr key={book.id}>
                        <td>{book.titre}</td>
                        <td>{book.auteur}</td>
                        <td>
                          <button onClick={() => handleReturnBook(book.id)}>
                            Rendre
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          <div className="book-list">
            <h2>Liste des Livres</h2>
            <table>
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Auteur</th>
                  <th>Description</th>
                  <th>Date Publication</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, index) => (
                  <tr key={book.id}>
                    <td>{book.titre}</td>
                    <td>{book.auteur}</td>
                    <td>{book.description}</td>
                    <td>{book.datePublication}</td>
                    <td>{book.isAvailable ? 'Disponible' : 'Emprunté'}</td>
                    <td>
                      {user.isAdmin && (
                        <>
                          <button onClick={() => handleEditBook(book)}>
                            Modifier
                          </button>
                          <button onClick={() => handleRemoveBook(book.id)}>
                            Supprimer
                          </button>
                        </>
                      )}
                      {!user.isAdmin && book.isAvailable && (
                        <button onClick={() => handleBorrowBook(book.id)}>
                          Emprunter
                        </button>
                      )}
                      {!user.isAdmin && !book.isAvailable && (
                        <button disabled>Indisponible</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card">
          <Logo className="logo" />
          <h2>Se connecter</h2>
          {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Email"
              type="email"
              required
              name="email"
              value={email}
              onChange={handleChange}
            />
            <FormInput
              label="Password"
              type='password'
              required
              name='password'
              value={password}
              onChange={handleChange}
            />
            <div className="button-group">
              <button type="submit">Se connecter</button>
              <span>
                <button type="button" onClick={resetFormFields}>Effacer</button>
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;