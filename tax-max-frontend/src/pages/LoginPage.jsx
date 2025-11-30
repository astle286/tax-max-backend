import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { login } from "../utils/auth";
import { motion } from "framer-motion";
import "./../styles/LoginPage.css"; // ✅ Import styles

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      const res = await axios.post("http://localhost:5001/auth/login", {
        username,
        password,
      });

      const token = res.data.token;
      const user = jwtDecode(token);

      // ✅ Save token + normalized role
      login(token, user.role.toLowerCase());

      // ✅ Redirect based on role
      if (user.role.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role.toLowerCase() === "staff") {
        navigate("/tax-records");
      } else if (user.role.toLowerCase() === "viewer") {
        navigate("/family-records");
      } else {
        navigate("/login"); // fallback
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password.");
    }
  };

  return (
    <motion.div
      className="login-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <form onSubmit={handleLogin}>
        <h2>Tax-Max</h2>
        {error && <div className="error-message">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username" // ✅ autofill
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password" // ✅ autofill
        />
        <button type="submit">Login</button>
      </form>

      {/* Bottom-left logo */}
      <div className="logo">
        <img src="/logo.png" alt="Tax-max logo" height="64" />
      </div>

      {/* Bottom-right contact info */}
      <div className="contact-info">
        <div>Contact us</div>
        <a href="mailto:support@taxmax.com">mail</a>
        <a href="tel:+1234567890">phone</a>
        <a href="https://www.youtube.com/@astle4387">Astle</a>
      </div>
    </motion.div>
  );
}
