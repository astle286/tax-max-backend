import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // ✅ navigation hook
import axios from "axios";
import "./../styles/FamilyRecords.css";
import ErrorPage from "./../components/ErrorPage";

function FamilyRecords() {
  const [filters, setFilters] = useState({
    familyId: "",
    name: "",
    memberId: "",
    group: ""
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      let res;

      // ✅ Search by member name → /family/search?q=
      if (filters.name) {
        res = await axios.get("http://localhost:5002/family/search", {
          params: { q: filters.name }
        });
        setResults(
          res.data.map((m) => ({
            name: m.name,
            group: "",
            familyId: m.family_id,
            memberId: m.id
          }))
        );
      }
      // ✅ Search by familyId → /family/:id
      else if (filters.familyId) {
        res = await axios.get(`http://localhost:5002/family/${filters.familyId}`);
        const f = res.data;
        setResults(
          f.members.map((m) => ({
            name: m.name,
            group: f.group,
            familyId: f.id,
            memberId: m.id
          }))
        );
      }
      // ✅ Otherwise → list all families
      else {
        res = await axios.get("http://localhost:5002/family/list");
        setResults(
          res.data.map((f) => ({
            name: "",
            group: f.group,
            familyId: f.id,
            memberId: ""
          }))
        );
      }
    } catch (err) {
      console.error("Search failed:", err);
      const backendError = err.response?.data;
      setError(
        backendError || { error: "Search Failed", message: "Unexpected error occurred" }
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFamily = () => {
    navigate("/AddFamily"); // ✅ navigate to AddFamily.jsx
  };

  if (error) {
    return <ErrorPage error={error.error} message={error.message} />;
  }

  return (
    <motion.div
      className="family-records"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Family Records</h2>

      <div className="filters">
        <input
          name="familyId"
          placeholder="FAMILY_ID"
          value={filters.familyId}
          onChange={handleChange}
        />
        <input
          name="name"
          placeholder="NAME"
          value={filters.name}
          onChange={handleChange}
        />
        <input
          name="memberId"
          placeholder="MEMBER_ID"
          value={filters.memberId}
          onChange={handleChange}
        />
        <input
          name="group"
          placeholder="GROUP"
          value={filters.group}
          onChange={handleChange}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "SEARCH"}
        </button>
        <button onClick={handleAddFamily}>ADD FAMILY</button>
      </div>

      <div className="results">
        <h4>RESULTS ({results.length})</h4>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>GROUP</th>
              <th>FAMILY_ID</th>
              <th>MEMBER_ID</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>{item.group}</td>
                <td>
                  {item.familyId && (
                    <button
                      className="family-link"
                      onClick={() => navigate(`/Family/${item.familyId}`)}
                    >
                      {item.familyId}
                    </button>
                  )}
                </td>
                <td>
                  {item.memberId && (
                    <button
                      className="member-link"
                      onClick={() => navigate(`/Member/${item.memberId}`)}
                    >
                      {item.memberId}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default FamilyRecords;
