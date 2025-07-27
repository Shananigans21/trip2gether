// src/components/Activities.jsx
import { useState } from 'react';
import { searchLocations } from '../services/travel';

export default function Activities() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const locations = await searchLocations(query);
      setResults(locations);
    } catch (err) {
      setError('Failed to fetch activities. Try again.');
    }
    setLoading(false);
  }

  return (
    <div>
      <h2>Search Activities by Location</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter a location"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {results.map((loc, i) => (
          <li key={i}>
            {loc.name} — {loc.result_type}
          </li>
        ))}
      </ul>
    </div>
  );
}
