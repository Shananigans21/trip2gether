import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/signup">Signup</Link> |{" "}
      <Link to="/login">Login</Link> |{" "}
      <Link to="/trips">Trips</Link> |{" "}
     <Link to="/hotels">Hotels</Link> |{" "}
     <Link to="/trips/new">New Trip</Link>

      

    </nav>
  );
}
