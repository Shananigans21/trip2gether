import { Routes, Route } from 'react-router-dom';
import TripListPage from './pages/TripListPage';
import TripDetailPage from './pages/TripDetailPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import HotelsPage from './pages/HotelsPage';
import NewTripPage from './pages/NewTripPage';
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
      <Route path="/" element={<HomePage />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/trips" element={<TripListPage />} />
        <Route path="/trips/:tripId" element={<TripDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/trips/new" element={<NewTripPage />} />
      </Routes>
    </>
  );
}

export default App;
