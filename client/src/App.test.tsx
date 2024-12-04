import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { 
  getData, 
  BOOKS, 
  USERS, 
  addBook, 
  borrowBook, 
  returnBook, 
  removeBook, 
  updateBook 
} from './utils/data-utils';
import App from './App';
import AddBookForm from './components/add-book-form';

describe('Data Utility Functions', () => {
  beforeEach(() => {
    BOOKS.splice(0, BOOKS.length, 
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
    );

    USERS.splice(0, USERS.length, 
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
    );
  });

  describe('getData', () => {
    it('vérfier les infos de connexion', async () => {
      const user = await getData('http://localhost:8000/login', 'john@mail.com', '1234');
      expect(user).toEqual(USERS[0]);
    });

    it('erreur pour mauvais identifiants', async () => {
      await expect(getData('http://localhost:8000/login', 'invalid@mail.com', 'wrong')).rejects.toThrow('Invalid credentials');
    });
  });

  describe('addBook', () => {
    it('ajout d\'un livre', () => {
      const newBook = {
        titre: 'Test Book',
        auteur: 'Test Author',
        description: 'Test Description',
        datePublication: '2023-01-01'
      };

      const addedBook = addBook(newBook);
      
      expect(addedBook).toEqual({
        ...newBook,
        id: 3,
        isAvailable: true
      });
      expect(BOOKS).toHaveLength(3);
      expect(BOOKS[2]).toEqual(addedBook);
    });
  });

  describe('borrowBook', () => {
    it('emprunt d\'un livre disponible', () => {
      const result = borrowBook(2, 1);
      
      expect(result).toBe(true);
      const book = BOOKS.find(b => b.id === 1);
      const user = USERS.find(u => u.id === 2);
      
      expect(book?.isAvailable).toBe(false);
      expect(user?.borrowedBooks).toContain(1);
    });

    it('erreur emprunt livre non disponible', () => {
      borrowBook(2, 1);
      
      const result = borrowBook(2, 1);
      
      expect(result).toBe(false);
    });
  });

  describe('returnBook', () => {
    it('retour d\'un livre emprunté', () => {
      borrowBook(2, 1);
      
      const result = returnBook(2, 1);
      
      expect(result).toBe(true);
      const book = BOOKS.find(b => b.id === 1);
      const user = USERS.find(u => u.id === 2);
      
      expect(book?.isAvailable).toBe(true);
      expect(user?.borrowedBooks).not.toContain(1);
    });

  });

  describe('removeBook', () => {
    it('supression livre', () => {
      const initialLength = BOOKS.length;
      const result = removeBook(1);
      
      expect(result).toBe(true);
      expect(BOOKS).toHaveLength(initialLength - 1);
      expect(BOOKS.find(b => b.id === 1)).toBeUndefined();
    });
  });

  describe('updateBook', () => {
    it('modification d\'un livre', () => {
      const updatedBookData = {
        titre: 'Updated Title',
        description: 'Updated Description'
      };

      const result = updateBook(1, updatedBookData);
      
      expect(result).toEqual({
        ...BOOKS[0],
        titre: 'Updated Title',
        description: 'Updated Description'
      });
    });

  });
});
