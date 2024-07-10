import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DogsList() {
  const [dogs, setDogs] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate()

  const getDogs = async () => {
    try {
      const response = await fetch('http://localhost:3003/api/dogs');
      const data = await response.json();
      setDogs(data);
      setError('')
    } catch (e) {
      setError(e.message)
    }
  };

  const deleteDog = async (id) => {
    await fetch(`http://localhost:3003/api/dogs/${id}`, {
      method: 'DELETE',
    })
    setDogs(dogs.filter(dog => dog.id !== id))
  }

  useEffect(() => {
    getDogs();
  }, []);

  return (
    <>
      {error ? (
        <>{error}</>
      ) : (
        <div>
          <h2>Dogs Shelter</h2>
          <ul>
            {dogs.map((dog) => (
              <li key={dog.id}>
                {dog.name}, {dog.breed}, {dog.adopted ? 'adopted' : 'NOT adopted'}
                <div>
                  <button onClick={() => navigate('/form', {state: {dog: dog}})}>Edit</button>
                  <button onClick={() => deleteDog(dog.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
