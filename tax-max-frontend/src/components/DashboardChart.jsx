import { useEffect, useState } from "react";
import ReactFrappeChart from 'react-frappe-charts';
import axios from "axios";

function DashboardChart() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5005/api/dashboard-summary")
      .then(res => {
        const labels = res.data.map(m => m.metric_name);
        const values = res.data.map(m => m.metric_value);

        setData({
          labels,
          datasets: [{ values }]
        });
      })
      .catch(err => console.error("Chart API error:", err));
  }, []);

  if (!data) return <p>Loading chart...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h3>Dashboard Metrics Overview</h3>
      <ReactFrappeChart
        type="bar"
        data={data}
        height={250}
        colors={["#21ba45"]}
      />
    </div>
  );
}

export default DashboardChart;
