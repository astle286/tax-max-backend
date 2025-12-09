import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/FamilyRecords.css";
import ErrorPage from "./../components/ErrorPage";

function FamilyRecords() {
  const [filters, setFilters] = useState({
    familyId: "",
    familyNumber: "",
    name: "",
    group: ""
  });
  const [results, setResults] = useState([]);
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // families per page
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // ✅ Helper: lock other fields once one has data
  const isLocked = (field) => {
    if (filters[field]) return false; // active field stays open
    return Object.keys(filters).some(
      (key) => key !== field && filters[key] !== ""
    );
  };

  const handleSearch = async (pageOverride = 1) => {
    setLoading(true);
    setError(null);
    try {
      let res;

      if (filters.name) {
        setSearchType("name");
        res = await axios.get("http://localhost:5002/family/search", {
        params: { q: filters.name }
      });

        const members = res.data.members || [];
        const familyCache = {};

        const enriched = await Promise.all(
      members.map(async (m) => {
      if (!familyCache[m.family_id]) {
        const famRes = await axios.get(`http://localhost:5002/family/${m.family_id}`);
        familyCache[m.family_id] = {
          family_number: famRes.data.family_number,
          group: famRes.data.group
        };
      }
      return {
        ...m,
        family_number: familyCache[m.family_id].family_number,
        group: familyCache[m.family_id].group
      };
      })
        );

        setResults(enriched);
        setTotalPages(1);
        }else if (filters.familyId) {
        setSearchType("familyId");
        res = await axios.get(`http://localhost:5002/family/${filters.familyId}`);
        setResults([res.data]);
        setTotalPages(1);
      } else if (filters.familyNumber) {
        setSearchType("familyNumber");
        res = await axios.get("http://localhost:5002/family/search", {
          params: { q: filters.familyNumber }
        });
        setResults(res.data.families || []);
        setTotalPages(1);
      } else if (filters.group) {
        setSearchType("group");
        res = await axios.get("http://localhost:5002/family/list", {
          params: { page: pageOverride, limit }
        });
        const filtered = res.data.families.filter(f => f.group === filters.group);
        setResults(filtered);
        setTotalPages(res.data.pages);
      } else {
        setSearchType("all");
        res = await axios.get("http://localhost:5002/family/list", {
          params: { page: pageOverride, limit }
        });
        setResults(res.data.families || []);
        setTotalPages(res.data.pages);
      }

      setPage(pageOverride);
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
    navigate("/AddFamily");
  };

  const handleClear = () => {
    setFilters({ familyId: "", familyNumber: "", name: "", group: "" });
    setResults([]);
    setSearchType("");
    setPage(1);
    setTotalPages(1);
  };

  useEffect(() => {
    // Load first page by default
    handleSearch(1);
  }, []);

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
          disabled={isLocked("familyId")}
          className={filters.familyId ? "active-input" : ""}
        />
        <input
          name="familyNumber"
          placeholder="FAMILY_NUMBER"
          value={filters.familyNumber}
          onChange={handleChange}
          disabled={isLocked("familyNumber")}
          className={filters.familyNumber ? "active-input" : ""}
        />
        <input
          name="name"
          placeholder="MEMBER NAME"
          value={filters.name}
          onChange={handleChange}
          disabled={isLocked("name")}
          className={filters.name ? "active-input" : ""}
        />
        <input
          name="group"
          placeholder="GROUP"
          value={filters.group}
          onChange={handleChange}
          disabled={isLocked("group")}
          className={filters.group ? "active-input" : ""}
        />

        <button onClick={() => handleSearch(1)} disabled={loading}>
          {loading ? "Searching..." : "SEARCH"}
        </button>
        <button onClick={handleAddFamily}>ADD FAMILY</button>
        <button onClick={handleClear}>CLEAR</button>
      </div>

      <div className="results">
  <h4>RESULTS ({results.length})</h4>

  {results.length === 0 ? (
    <div className="no-results">No results found</div>
  ) : (
    <div className="card-grid">
      {results.map((item, idx) => (
        <div key={idx} className="card">
          {searchType === "name" ? (
            <>
              <h3>{item.name}</h3>
              <p><strong>Family ID:</strong> {item.family_id}</p>
              <p><strong>Family Number:</strong> {item.family_number || ""}</p>
              <p><strong>Group:</strong> {item.group || ""}</p>
            </>
          ) : (
            <>
              <p><strong>Family ID:</strong> {item.id}</p>
              <p><strong>Family Number:</strong> {item.family_number}</p>
              <p><strong>Group:</strong> {item.group}</p>
              <div>
                <strong>Members:</strong>
                <ul>
                  {item.members && item.members.map((m, i) => (
                    <li key={i}>{m.name} ({m.role})</li>
                  ))}
                </ul>
              </div>
            </>
          )}
          <button
            className="family-link"
            onClick={() => navigate(`/Family/${searchType === "name" ? item.family_id : item.id}`)}
          >
            View Family
          </button>
        </div>
      ))}
    </div>
  )}

  {/* ✅ Pagination Controls with Symbols */}
  {searchType === "all" || searchType === "group" ? (
    <div className="pagination">
      <button disabled={page <= 1} onClick={() => handleSearch(page - 1)}>«</button>
      <span>Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => handleSearch(page + 1)}>»</button>
    </div>
  ) : null}
</div>

    </motion.div>
  );
}

export default FamilyRecords;
