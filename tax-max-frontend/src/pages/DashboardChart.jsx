import { useEffect, useState } from "react";
import ReactFrappeChart from 'react-frappe-charts';

function DashboardChart() {
  const [userChartData, setUserChartData] = useState(null);
  const [mixedChartData, setMixedChartData] = useState(null);
  const [percentageData, setPercentageData] = useState(null);
  const useFakeData = true;

  const fetchData = () => {
    if (useFakeData) {
      // Bar chart for Users
      setUserChartData({
        labels: ["Total Users"],
        datasets: [{ values: [130 + Math.floor(Math.random() * 10)] }]
      });

      // Axis-mixed chart for Filings + Revenue
      setMixedChartData({
        labels: ["Tax Filings", "Revenue Collected"],
        datasets: [
          { name: "Tax Filings", type: "bar", values: [300 + Math.floor(Math.random() * 5), null] },
          { name: "Revenue Collected", type: "line", values: [null, 560 + Math.floor(Math.random() * 10000)] }
        ]
      });

      // Percentage chart for Pending Approvals
      const totalApprovals = 100;
      const pending = 14 + Math.floor(Math.random() * 3);
      const approved = totalApprovals - pending;
      setPercentageData({
        labels: ["Approved", "Pending"],
        datasets: [{ values: [approved, pending] }]
      });
    }
  };

  useEffect(() => {
    fetchData(); // Initial load
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <h3>Total Users</h3>
      {userChartData && (
        <ReactFrappeChart
          type="bar"
          data={userChartData}
          height={200}
          colors={["#21ba45"]}
          animate={true}
        />
      )}

      <h3 style={{ marginTop: "3rem" }}>Tax Filings & Revenue</h3>
      {mixedChartData && (
        <ReactFrappeChart
          type="axis-mixed"
          data={mixedChartData}
          height={250}
          colors={["#2185d0", "#f2711c"]}
          animate={true}
        />
      )}

      <h3 style={{ marginTop: "3rem" }}>Pending Approvals</h3>
      {percentageData && (
        <ReactFrappeChart
          type="percentage"
          data={percentageData}
          height={200}
          colors={["#00b5ad", "#f2711c"]}
          animate={true}
        />
      )}
    </div>
  );
}

export default DashboardChart;
