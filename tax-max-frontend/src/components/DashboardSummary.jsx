import { useEffect, useState } from "react";
import './DashboardSummary.css';


function DashboardSummary() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5005/api/dashboard-summary")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard metrics:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard metrics...</p>;

  return (
    <div className="dashboard-summary">
      <h2>Dashboard Summary</h2>
      <ul>
        {metrics.map((metric) => (
          <li key={metric.metric_name}>
            <strong>{metric.metric_name}:</strong> {metric.metric_value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardSummary;
