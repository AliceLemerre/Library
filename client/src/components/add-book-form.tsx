import React, { useState, ChangeEvent, FormEvent } from 'react';
import FormInput from './form-input/form-input';
import { addBook } from '../utils/data-utils';

type AddBookFormProps = {
  onBookAdded: () => void;
};

const defaultFormFields = {
  titre: '',
  auteur: '',
  description: '',
  datePublication: '',
};

const AddBookForm: React.FC<AddBookFormProps> = ({ onBookAdded }) => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { titre, auteur, description, datePublication } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormFields({ ...formFields, [name]: value });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      addBook({
        titre,
        auteur,
        description,
        datePublication,
      });
      
      resetFormFields();
      onBookAdded();
    } catch (error) {
      alert('Failed to add book');
    }
  };

  return (
    <div>
      <h2>Ajouter un Livre</h2>
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Titre"
          type="text"
          required
          name="titre"
          value={titre}
          onChange={handleChange}
        />
        <FormInput
          label="Auteur"
          type="text"
          required
          name="auteur"
          value={auteur}
          onChange={handleChange}
        />
        <FormInput
          label="Description"
          type="text"
          required
          name="description"
          value={description}
          onChange={handleChange}
        />
        <FormInput
          label="Date de Publication"
          type="text"
          required
          name="datePublication"
          value={datePublication}
          onChange={handleChange}
        />
        <button type="submit">Ajouter Livre</button>
      </form>
    </div>
  );
};

export default AddBookForm;