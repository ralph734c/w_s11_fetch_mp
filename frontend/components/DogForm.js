import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const initialForm = { name: '', breed: '', adopted: false };

// Use this form for both POST and PUT requests!
export default function DogForm() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialForm);
  const [breeds, setBreeds] = useState([]);
  const { state } = useLocation();

  const onSubmit = (event) => {
    event.preventDefault();
    if (state) updateDog();
    else addDog();
  };
  const onChange = (event) => {
    const { name, value, type, checked } = event.target;
    setValues({
      ...values,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const updateDog = async () => {
    await fetch(`http://localhost:3003/api/dogs/${values.id}`, {
      method: 'PUT',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    navigate('/');
  };

  const addDog = async () => {
    await fetch('http://localhost:3003/api/dogs/', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    navigate('/');
  };

  const getBreeds = async () => {
    const response = await fetch('http://localhost:3003/api/dogs/breeds');
    const data = await response.json();
    setBreeds(data);
  };
  useEffect(() => {
    getBreeds();
    if (state) setValues(state.dog);
  }, []);

  return (
    <div>
      <h2>Create Dog</h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Name"
          aria-label="Dog's name"
        />
        <select
          name="breed"
          value={values.breed}
          onChange={onChange}
          aria-label="Dog's breed"
        >
          <option value="">---Select Breed---</option>
          {breeds.map((breed, index) => (
            <option key={index} value={breed}>
              {breed}
            </option>
          ))}
        </select>
        <label>
          Adopted:{' '}
          <input
            type="checkbox"
            name="adopted"
            checked={values.adopted}
            onChange={onChange}
            aria-label="Is the dog adopted?"
          />
        </label>
        <div>
          <button type="submit">{state ? 'Update Dog' : 'Create Dog'}</button>
          <button aria-label="Reset form">Reset</button>
        </div>
      </form>
    </div>
  );
}
