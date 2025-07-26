import React, { useEffect, useState } from 'react';

export default function TripListPage() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [editingTrip, setEditingTrip] = useState(null);
  const [editData, setEditData] = useState({ destination: '', date: '', description: '' });

  // Fetch trips
  useEffect(() => {
    fetchTrips();
  }, []);

  function fetchTrips() {
    fetch('http://localhost:5001/trips', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching trips: ${res.status} ${res.statusText}`);
        return res.json();
      })
      .then((data) => setTrips(data))
      .catch((err) => setError(err.message));
  }

  // Delete trip handler
  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;

    fetch(`http://localhost:5001/trips/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete trip');
        // Update local trips list and clear details if deleted trip was selected
        setTrips((prev) => prev.filter((trip) => trip.id !== id));
        if (selectedTrip?.id === id) setSelectedTrip(null);
      })
      .catch((err) => alert(err.message));
  }

  // Start editing
  function handleEditStart(trip) {
    setEditingTrip(trip.id);
    setEditData({
      destination: trip.destination || '',
      date: trip.date || '',
      description: trip.description || '',
    });
  }

  // Cancel editing
  function handleEditCancel() {
    setEditingTrip(null);
  }

  // Save edited trip
  function handleEditSave(id) {
    fetch(`http://localhost:5001/trips/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update trip');
        return res.json();
      })
      .then((updatedTrip) => {
        setTrips((prev) => prev.map((trip) => (trip.id === id ? updatedTrip : trip)));
        setSelectedTrip(updatedTrip);
        setEditingTrip(null);
      })
      .catch((err) => alert(err.message));
  }

  if (error) return <div style={styles.error}>Error: {error}</div>;

  if (trips.length === 0)
    return <div style={styles.empty}>No trips found. Start planning your first trip!</div>;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>🌍 Your Trips</h1>

      <ul style={styles.list}>
        {trips.map((trip) => (
          <li
            key={trip.id}
            style={{
              ...styles.card,
              borderColor: selectedTrip?.id === trip.id ? '#2563eb' : '#e2e8f0',
              boxShadow:
                selectedTrip?.id === trip.id
                  ? '0 0 10px rgba(37, 99, 235, 0.5)'
                  : '0 3px 8px rgba(100, 116, 139, 0.1)',
            }}
            onClick={() => setSelectedTrip(trip)}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setSelectedTrip(trip);
              }
            }}
            role="button"
            aria-pressed={selectedTrip?.id === trip.id}
          >
            <h3 style={styles.destination}>{trip.destination}</h3>
            <p style={styles.date}>{trip.date}</p>
            {trip.description && <p style={styles.description}>{trip.description}</p>}
          </li>
        ))}
      </ul>

      {selectedTrip && (
        <section style={styles.detailsSection}>
          <h2 style={styles.detailsTitle}>Trip Details</h2>
          {/* Trip photo */}
          {selectedTrip.photo_url ? (
            <img
              src={selectedTrip.photo_url}
              alt={`Photo of ${selectedTrip.destination}`}
              style={styles.photo}
            />
          ) : (
            <p style={{ fontStyle: 'italic', color: '#64748b' }}>No photo available</p>
          )}

          {editingTrip === selectedTrip.id ? (
            <>
              <label>
                Destination:{' '}
                <input
                  type="text"
                  value={editData.destination}
                  onChange={(e) => setEditData({ ...editData, destination: e.target.value })}
                />
              </label>
              <br />
              <label>
                Date:{' '}
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                />
              </label>
              <br />
              <label>
                Description:{' '}
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </label>
              <br />
              <button style={styles.saveButton} onClick={() => handleEditSave(selectedTrip.id)}>
                Save
              </button>
              <button style={styles.cancelButton} onClick={handleEditCancel}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>
                <strong>Destination:</strong> {selectedTrip.destination}
              </p>
              <p>
                <strong>Date:</strong> {selectedTrip.date}
              </p>
              {selectedTrip.description && (
                <p>
                  <strong>Description:</strong> {selectedTrip.description}
                </p>
              )}
              <button style={styles.editButton} onClick={() => handleEditStart(selectedTrip)}>
                Edit
              </button>
              <button style={styles.deleteButton} onClick={() => handleDelete(selectedTrip.id)}>
                Delete
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 900,
    margin: '40px auto',
    padding: '0 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: 30,
    color: '#1e293b',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20,
  },
  card: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 12,
    border: '2px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  destination: {
    margin: '0 0 8px 0',
    color: '#2563eb',
  },
  date: {
    margin: '0 0 12px 0',
    fontWeight: '600',
    color: '#64748b',
  },
  description: {
    fontSize: 14,
    color: '#475569',
  },
  detailsSection: {
    marginTop: 40,
    padding: 20,
    border: '2px solid #2563eb',
    borderRadius: 12,
    backgroundColor: '#e0e7ff',
  },
  detailsTitle: {
    marginTop: 0,
    color: '#1e293b',
  },
  photo: {
    width: '100%',
    maxHeight: 300,
    objectFit: 'cover',
    borderRadius: 12,
    marginBottom: 15,
  },
  editButton: {
    marginRight: 10,
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  deleteButton: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  saveButton: {
    marginRight: 10,
    padding: '8px 16px',
    backgroundColor: '#16a34a',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
  },
  empty: {
    fontStyle: 'italic',
    color: '#64748b',
    textAlign: 'center',
    marginTop: 50,
  },
};
