import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewTripPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5001/trips', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ destination, date, description })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Trip created:', data);
        navigate('/trips'); 
      })
      .catch((err) => {
        console.error('Error creating trip:', err);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Destination"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <input
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">Create Trip</button>
    </form>
  );
}

export default NewTripPage;
