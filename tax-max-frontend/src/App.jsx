import './App.css';
import Header from './components/Header';
import {
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';
import {
  FaHome,
  FaFileAlt,
  FaUsers,
  FaUserCheck,
  FaDownload,
  FaCog,
  FaUserPlus
} from 'react-icons/fa';
import AdminDashboard from './pages/AdminDashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './routes/ProtectedRoute';
import { isAuthenticated, getUserRole } from './utils/auth';
import { AnimatePresence } from 'framer-motion';
import FamilyRecords from './pages/FamilyRecords';
import FamilyView from './pages/FamilyView';
import MemberView from './pages/MemberView';
import Exports from './pages/Exports';
import TaxRecords from './pages/TaxRecords';
import TransactionsView from './pages/TransactionsView';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import AddFamily from './pages/AddFamily';
import EditFamily from './pages/EditFamily';   // ✅ NEW import
import CreateUser from './pages/CreateUser';
import UserProfile from './pages/UserProfile';
import BackButton from './components/BackButton';

// ✅ Shared layout wrapper with BackButton
function MainLayout() {
  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <BackButton label="← Back" />
      </div>
      <Outlet />
    </div>
  );
}

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const role = getUserRole();

  return (
    <div>
      {!isLoginPage && <Header />}
      <div className="app-container">
        {!isLoginPage && (
          <nav className="sidebar">
            <ul>
              {role === "admin" && (
                <>
                  <li><Link to="/AdminDashboard"><FaHome /> Dashboard</Link></li>
                  <li><Link to="/Users"><FaUsers /> Users</Link></li>
                  <li><Link to="/TaxRecords"><FaFileAlt /> Tax Records</Link></li>
                  <li><Link to="/FamilyRecords"><FaUserCheck /> Family Records</Link></li>
                  <li><Link to="/Exports"><FaDownload /> Exports</Link></li>
                  <li><Link to="/Settings"><FaCog /> Settings</Link></li>
                </>
              )}
              {role === "staff" && (
                <>
                  <li><Link to="/TaxRecords"><FaFileAlt /> Tax Records</Link></li>
                  <li><Link to="/FamilyRecords"><FaUserCheck /> Family Records</Link></li>
                  <li><Link to="/Exports"><FaDownload /> Exports</Link></li>
                  <li><Link to="/Settings"><FaCog /> Settings</Link></li>
                </>
              )}
              {role === "viewer" && (
                <li><Link to="/FamilyRecords"><FaUserCheck /> Family Records</Link></li>
              )}
            </ul>
          </nav>
        )}

        <main className="main-panel">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<LoginPage />} />

              {/* Wrap all protected routes in MainLayout */}
              <Route element={<MainLayout />}>
                {/* Admin routes */}
                <Route
                  path="/AdminDashboard"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Users"
                  element={
                    <ProtectedRoute role="admin">
                      <Users />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/CreateUser"
                  element={
                    <ProtectedRoute role="admin">
                      <CreateUser />
                    </ProtectedRoute>
                  }
                />
                <Route
                  
                  path="/user/:username"
                  element={
                    <ProtectedRoute role="admin">
                      <UserProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Shared routes */}
                <Route
                  path="/TaxRecords"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <TaxRecords />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/FamilyRecords"
                  element={
                    <ProtectedRoute role="admin,staff,viewer">
                      <FamilyRecords />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Family/:familyId"
                  element={
                    <ProtectedRoute role="admin,staff,viewer">
                      <FamilyView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-family/:familyId"   // ✅ NEW route
                  element={
                    <ProtectedRoute role="admin,staff">
                      <EditFamily />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Member/:memberId"
                  element={
                    <ProtectedRoute role="admin,staff,viewer">
                      <MemberView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Transactions/:familyId"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <TransactionsView />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AddTransaction/:familyId"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <AddTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/EditTransaction/:transactionId"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <EditTransaction />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/AddFamily"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <AddFamily />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Exports"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <Exports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/Settings"
                  element={
                    <ProtectedRoute role="admin,staff">
                      <Settings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Default redirect */}
              <Route
                path="/"
                element={
                  isAuthenticated() ? (
                    role === "admin" ? <Navigate to="/AdminDashboard" />
                    : role === "staff" ? <Navigate to="/TaxRecords" />
                    : role === "viewer" ? <Navigate to="/FamilyRecords" />
                    : <Navigate to="/login" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
