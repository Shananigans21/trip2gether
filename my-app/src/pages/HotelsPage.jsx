import { useEffect, useState } from 'react';
import { fetchHotelsInCity, fetchLocationSuggestions } from "../services/travel";

export default function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [city, setCity] = useState('New York');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchHotelsInCity(city)
      .then(data => {
        const hotelResults = data.data?.filter(item => item.result_type === 'lodging');
        setHotels(hotelResults || []);
      })
      .catch(error => console.error('Error fetching hotels:', error));
  }, [city]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      fetchLocationSuggestions(searchTerm)
        .then(data => setSuggestions(data.locations || []))
        .catch(() => setSuggestions([]));
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSelectCity = (name) => {
    setCity(name);
    setSearchTerm('');
    setSuggestions([]);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Search Hotels</h2>

      <div style={styles.searchBox}>
        <input
          style={styles.input}
          placeholder="Enter a city or country..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {suggestions.length > 0 && (
          <ul style={styles.suggestions}>
            {suggestions.map((loc, index) => (
              <li key={index} onClick={() => handleSelectCity(loc.name)} style={styles.suggestionItem}>
                {loc.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <h3 style={styles.subheading}>Hotels in {city}</h3>
      <ul style={styles.hotelList}>
        {hotels.map((item) => {
          const hotel = item.result_object;
          const photo = hotel?.photo?.images?.small?.url;

          return (
            <li key={hotel?.location_id} style={styles.hotelItem}>
              <div style={styles.hotelCard}>
                {photo && <img src={photo} alt={hotel.name} style={styles.hotelImage} />}
                <div>
                  <h4 style={styles.hotelName}>{hotel.name}</h4>
                  <p style={styles.hotelDetail}>📍 {hotel.address || 'Address unavailable'}</p>
                  <p style={styles.hotelDetail}>⭐ {hotel.rating || 'No rating'}</p>
                  {hotel.web_url && (
                    <a href={hotel.web_url} target="_blank" rel="noreferrer" style={styles.hotelLink}>
                      View on TripAdvisor →
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    padding: '0 20px',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '20px',
    color: '#2d3748',
  },
  subheading: {
    fontSize: '22px',
    marginTop: '30px',
    color: '#4a5568',
  },
  searchBox: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  suggestions: {
    listStyle: 'none',
    padding: 0,
    marginTop: '4px',
    background: '#fff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
  suggestionItem: {
    padding: '10px',
    cursor: 'pointer',
  },
  hotelList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '20px',
  },
  hotelItem: {
    padding: '10px 0',
    borderBottom: '1px solid #eee',
  },
  hotelCard: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  hotelImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
  },
  hotelName: {
    fontSize: '18px',
    margin: '0 0 8px',
  },
  hotelDetail: {
    margin: '4px 0',
    color: '#555',
  },
  hotelLink: {
    color: '#3182ce',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};
