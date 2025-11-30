import { useEffect, useState } from "react";
import axios from "axios";
import DashboardChart from "./DashboardChart";
import { FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchSummary = () => {
    setLoading(true);
    axios
      .get("http://localhost:5005/api/dashboard-summary")
      .then((res) => {
        const metrics = {};
        res.data.forEach(({ metric_name, metric_value }) => {
          metrics[metric_name] = metric_value;
        });
        setSummary(metrics);
        setLastUpdated(new Date());
        setTimeout(() => setLoading(false), 500);
      })
      .catch((err) => {
        console.error("Summary API error:", err);
        setTimeout(() => setLoading(false), 500);
      });
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 30000);
    return () => clearInterval(interval);
  }, []);

  const cardStyle = {
    backgroundColor: "#f9f9f9",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    flex: "1",
    minWidth: "200px",
    margin: "1rem",
  };

  return (
    <motion.div
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Dashboard</h2>

      {loading ? (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="fade-in"
              style={{ ...cardStyle, animationDelay: `${i * 0.2}s` }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Loading...</h3>
              <div className="shimmer"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }} className="fade-in">
            <div style={cardStyle}>
              <h3>Total Users</h3>
              <p>{summary.total_users}</p>
            </div>
            <div style={cardStyle}>
              <h3>Tax Filings</h3>
              <p>{summary.tax_filings}</p>
            </div>
            <div style={cardStyle}>
              <h3>Pending Approvals</h3>
              <p>{summary.pending_approvals}</p>
            </div>
            <div style={cardStyle}>
              <h3>Revenue Collected</h3>
              <p>₹{summary.revenue_collected?.toLocaleString()}</p>
            </div>
          </div>

          {lastUpdated && (
            <p
              onClick={fetchSummary}
              title="Click to refresh now"
              style={{
                margin: "1rem",
                fontStyle: "italic",
                color: "#666",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <FiRefreshCw className={loading ? "spin" : ""} />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}

          <DashboardChart />
        </>
      )}
    </motion.div>
  );
}
