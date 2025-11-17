import './App.css';
import Header from './components/Header';
import { Routes, Route, Link } from 'react-router-dom';
import { FaHome, FaFileAlt, FaUsers, FaCog } from 'react-icons/fa';
import Dashboard from './pages/Dashboard';
import TaxForm from './pages/TaxForm';
import Users from './pages/Users';
import Settings from './pages/Settings';

function App() {
  return (
    <div>
      <Header />
      <div className="app-container">
        <nav className="sidebar">
          <ul>
            <li><Link to="/"><FaHome /> Dashboard</Link></li>
            <li><Link to="/tax"><FaFileAlt /> Tax Form</Link></li>
            <li><Link to="/users"><FaUsers /> Users</Link></li>
            <li><Link to="/settings"><FaCog /> Settings</Link></li>
          </ul>
        </nav>
        <main className="main-panel">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tax" element={<TaxForm />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
