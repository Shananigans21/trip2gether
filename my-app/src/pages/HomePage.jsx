import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/check_session', {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not logged in');
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div
      style={{
        backgroundImage: 'url(https://www.traveljunctioninc.com/wp-content/uploads/2018/03/group-travel-banner.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 20px',
      }}
    >
      <h1 style={{ fontSize: '4rem', textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
        {user ? `Welcome back, ${user.username}!` : 'Welcome to Trip2gether!'}
      </h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '30px', textShadow: '1px 1px 6px rgba(0,0,0,0.5)' }}>
        {user
          ? 'Here are your upcoming trips.'
          : 'Plan, share, and explore your group adventures with ease.'}
      </p>

      {!user && (
        <div>
          <Link
            to="/login"
            style={{
              padding: '12px 24px',
              marginRight: '15px',
              backgroundColor: 'rgba(52, 152, 219, 0.85)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            style={{
              padding: '12px 24px',
              backgroundColor: 'rgba(46, 204, 113, 0.85)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
}

export default HomePage;
