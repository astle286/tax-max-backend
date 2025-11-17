import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactFrappeChart from 'react-frappe-charts';


function Dashboard() {
  const [summary, setSummary] = useState({});
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5005/api/dashboard-summary')
      .then(res => {
        const metrics = {};
        const labels = [];
        const values = [];

        res.data.forEach(({ metric_name, metric_value }) => {
          metrics[metric_name] = metric_value;
          labels.push(metric_name);
          values.push(metric_value);
        });

        setSummary(metrics);
        setChartData({
          labels,
          datasets: [{ values }]
        });

        setLoading(false);
      })
      .catch(err => {
        console.error('API error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  const cardStyle = {
    backgroundColor: '#f9f9f9',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    flex: '1',
    minWidth: '200px',
    margin: '1rem'
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
          <p>₹{summary.revenue_collected}</p>
        </div>
      </div>

      {chartData && (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
          <h3>Metrics Overview</h3>
          <ReactFrappeChart
            type="bar"
            data={chartData}
            height={250}
            colors={["#21ba45"]}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
