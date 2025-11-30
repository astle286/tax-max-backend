import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import "./../styles/UserProfile.css";
import { getToken } from "../utils/auth";
import ReactFrappeChart from "react-frappe-charts";

function UserProfile() {
  const { username } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activityData, setActivityData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const token = getToken();
        const res = await axios.get(
          `http://localhost:5001/auth/users/${username}/activity`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // Example response: [{date:"2025-11-20", logins:3, updates:1, deletions:0}, ...]
        setActivityData(res.data);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      }
    };
    fetchActivity();
  }, [username]);

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setMessage("Please enter a new password.");
      return;
    }

    try {
      const token = getToken();
      const res = await axios.put(
        `http://localhost:5001/auth/users/${username}/password`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Password updated successfully!");
      setNewPassword("");
    } catch (err) {
      console.error("Password update failed:", err);
      setMessage("❌ Failed to update password.");
    }
  };

  const handleBack = () => {
    navigate("/Users");
  };

  // ✅ Prepare chart data for multiple activity types
  const chartData = {
    labels: activityData.map((a) => a.date),
    datasets: [
      {
        name: "Logins",
        values: activityData.map((a) => a.logins),
      },
      {
        name: "Updates",
        values: activityData.map((a) => a.updates),
      },
      {
        name: "Deletions",
        values: activityData.map((a) => a.deletions),
      },
    ],
  };

  return (
    <motion.div
      className="user-profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>User Profile</h2>

      <div className="profile-header">
        <div className="photo">PHOTO</div>
        <div className="meta">
          <strong>USERNAME:</strong> {username}
        </div>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleUpdatePassword}>UPDATE PASSWORD</button>
        {message && <div className="message">{message}</div>}
      </div>

      <div className="back-btn-container">
        <button className="back-btn" onClick={handleBack}>
          ← Back to Users
        </button>
      </div>

      <div className="activity-chart">
        <h4>Activity Chart</h4>
        {activityData.length > 0 ? (
          <ReactFrappeChart
            type="axis-mixed"   // ✅ area charts are rendered via axis-mixed
            data={chartData}
            height={250}
            colors={["#007bff", "#28a745", "#dc3545"]}
            lineOptions={{
              regionFill: 1, // ✅ fills area under the line
            }}
          />
        ) : (
          <div className="chart-placeholder">No activity data available</div>
        )}
      </div>
    </motion.div>
  );
}

export default UserProfile;
