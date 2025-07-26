import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link, Navigate } from 'react-router-dom';
import API from "../services/api"; // use your axios wrapper

export default function TripDetailPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState('');
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    API.get('/trips')
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("Unexpected response format");
        }
        const foundTrip = res.data.find((t) => t.id === parseInt(tripId));
        if (foundTrip) {
          setTrip(foundTrip);
        } else {
          setError("Trip not found");
        }
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          setUnauthorized(true);
        } else {
          setError("Error loading trip");
        }
      });
  }, [tripId]);

  if (unauthorized) return <Navigate to="/login" />;
  if (error) return <p>{error}</p>;
  if (!trip) return <p>Loading trip...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{trip.destination}</h2>
      <p>{trip.description}</p>
      <p><strong>Date:</strong> {trip.date}</p>

      <h3>Hotels</h3>
      {trip.hotels.length ? (
        <ul>
          {trip.hotels.map((hotel) => (
            <li key={hotel.id}>
              {hotel.name} — {hotel.location}
            </li>
          ))}
        </ul>
      ) : <p>No hotels added yet.</p>}

      <h3>Activities</h3>
      {trip.activities.length ? (
        <ul>
          {trip.activities.map((activity) => (
            <li key={activity.id}>
              {activity.name} at {activity.time}
            </li>
          ))}
        </ul>
      ) : <p>No activities added yet.</p>}
    </div>
  );
}
