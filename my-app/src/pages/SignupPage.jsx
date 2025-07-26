import React, { useState } from 'react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
  
    fetch('http://localhost:5001/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session support
      body: JSON.stringify(formData),
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to sign up');
        return res.json();
      })
      .then(data => {
        console.log('Signup success:', data);
        // Optional: redirect or show success message
      })
      .catch(err => {
        console.error('Signup error:', err);
      });
  }  

  return (
    <div style={styles.container}>
      {/* Left: Description + Image */}
      <div style={styles.leftPanel}>
        <img
          src="https://external-preview.redd.it/zSnvWLDQ_8dkqyOuFZz8IqaOUyUjSjfVf4gwY7Z9ByA.jpg?auto=webp&s=273cb95fdd0ab5b08a82fa5add5153206ef110ad"
          alt="Travel"
          style={styles.image}
        />
        <div style={styles.descriptionBox}>
          <h1 style={styles.title}>Trip2gether</h1>
          <p style={styles.text}>
            Plan unforgettable group adventures with ease. From choosing the destination to finding
            the best hotels, Trip2gether brings your travel dreams to life — collaboratively!
          </p>
        </div>
      </div>

      {/* Right: Sign-up Form */}
      <div style={styles.rightPanel}>
        <h2 style={styles.formTitle}>Create an Account</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <label style={styles.label}>
            Username
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </label>

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  leftPanel: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(0.6)',
  },
  descriptionBox: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    color: 'white',
    maxWidth: '80%',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '10px',
    color: '#facc15',
  },
  text: {
    fontSize: '1.2rem',
    lineHeight: 1.6,
  },
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#f9fafb',
  },
  formTitle: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#1f2937',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '15px',
    color: '#374151',
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    marginTop: '5px',
  },
  button: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
};
