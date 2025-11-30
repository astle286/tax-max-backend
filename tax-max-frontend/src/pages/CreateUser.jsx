import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./../styles/CreateUser.css";
import { getToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = getToken();
      const res = await axios.post("http://localhost:5001/auth/register", form, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // ✅ Redirect to Users page with refresh flag and success message
      navigate("/Users", {
        state: {
          refresh: true,
          success: res.data.message || "User created successfully!"
        }
      });
    } catch (err) {
      console.error("User creation failed:", err);
      setError("❌ Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="create-user"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>CREATE USER</h2>

      {error && <div className="message error">{error}</div>}

      <form className="form" onSubmit={handleCreate}>
        <input
          name="username"
          placeholder="USERNAME"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="PASSWORD"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={form.role} onChange={handleChange} required>
          <option value="">SELECT ROLE</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="viewer">Viewer</option>
        </select>
        <button
          type="submit"
          disabled={loading || !form.username || !form.password || !form.role}
        >
          {loading ? "Creating..." : "CREATE"}
        </button>
      </form>
    </motion.div>
  );
}

export default CreateUser;
