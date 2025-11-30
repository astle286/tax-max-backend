import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../styles/TaxRecords.css";


function TaxRecords() {
  const [filters, setFilters] = useState({
    familyId: "",
    name: "",
    memberId: "",
    group: ""
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5005/api/tax-records", {
        params: filters
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const goToFamily = (id) => navigate(`/family/${id}`);
  const goToMember = (id) => navigate(`/member/${id}`);

  return (
    <motion.div
      className="tax-records"
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Tax Records</h2>

      <div className="filters" style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
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
        <button onClick={handleSearch}>SEARCH</button>
      </div>

      <div className="results">
        <h4>RESULTS ({results.length})</h4>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Group</th>
              <th>FAMILY_ID</th>
              <th>MEMBER_ID</th>
            </tr>
          </thead>
          <tbody>
            {results.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.group}</td>
                <td>
                  <button onClick={() => goToFamily(item.familyId)}>
                    {item.familyId}
                  </button>
                </td>
                <td>
                  <button onClick={() => goToMember(item.memberId)}>
                    {item.memberId}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

export default TaxRecords;
