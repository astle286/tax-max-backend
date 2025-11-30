import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./../styles/Users.css";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getToken } from "../utils/auth";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = getToken();
        const res = await axios.get("http://localhost:5001/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Could not load users.");
      }
    };

    // ✅ Trigger fetch if refresh flag is set or on initial load
    if (location.state?.refresh || users.length === 0) {
      fetchUsers();
    }

    // ✅ Clear navigation state after rendering
    if (location.state?.refresh || location.state?.success) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleCreateUser = () => {
    navigate("/CreateUser");
  };

  const goToUser = (username) => {
    navigate(`/user/${username}`);
  };

  return (
    <motion.div
      className="users-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>USERS</h2>
      <button className="create-user-btn" onClick={handleCreateUser}>
        CREATE USER
      </button>

      {/* ✅ Show success message if redirected from CreateUser */}
      {location.state?.success && (
        <div className="message success">{location.state.success}</div>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="user-table">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>ALL USERS</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id}>
                <td>{i + 1}</td>
                <td>
                  <button className="user-link" onClick={() => goToUser(u.username)}>
                    {u.username}
                  </button>
                </td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default Users;
