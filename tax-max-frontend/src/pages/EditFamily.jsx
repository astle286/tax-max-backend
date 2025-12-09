import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./../styles/EditFamily.css";
import "./../styles/FamilyView.css";
import ErrorPage from "./../components/ErrorPage"; 
import BackButton from "./../components/BackButton"; 
import { getUserRole } from "./../utils/auth"; // ✅ role check

function EditFamily() {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const role = getUserRole(); // ✅ get current user role

  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🚫 Block viewers
  if (role === "viewer") {
    return <ErrorPage error="Access Denied" message="You do not have permission to edit families." />;
  }

  // ✅ Fetch family + members on mount
  useEffect(() => {
    const fetchFamily = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5002/family/${familyId}`);
        setFamily(res.data);
        setMembers(res.data.members);
      } catch (err) {
        console.error("Failed to fetch family:", err);
        const backendError = err.response?.data;
        setError(backendError || { error: "Fetch Failed", message: "Unexpected error occurred" });
      } finally {
        setLoading(false);
      }
    };

    fetchFamily();
  }, [familyId]);

  const handleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleRemove = () => {
    setMembers(members.filter((_, i) => !selected.includes(i)));
    setSelected([]);
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);
    try {
      // ✅ Update family info (only group is editable)
      await axios.put(`http://localhost:5002/family/${familyId}`, {
        family_number: family.family_number, // read-only, passed unchanged
        group: family.group
      });

      // ✅ Update each member
      for (const m of members) {
        await axios.put(`http://localhost:5002/family/member/${m.id}`, {
          name: m.name,
          gender: m.gender,
          dob: m.dob,
          role: m.role, 
          mobile: m.mobile,
          email: m.email
        });
      }

      alert("Family and members updated successfully!");
      navigate(`/Family/${familyId}`); // ✅ redirect back to FamilyView
    } catch (err) {
      console.error("Failed to update family:", err);
      const backendError = err.response?.data;
      setError(backendError || { error: "Update Failed", message: "Unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading family...</p>;
  if (error) return <ErrorPage error={error.error} message={error.message} />;

  return (
    <motion.div
      className="edit-family"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >

      <h2>Edit Family</h2>
      <div><strong>FAMILY_ID:</strong> {family.id}</div>

      {/* ✅ Family fields (ID + number read-only, group editable) */}
      <div className="family-form" style={{ marginBottom: "1rem" }}>
        <input value={family.id} readOnly />
        <input value={family.family_number} readOnly />
        <select
          value={family.group}
          onChange={(e) => setFamily({ ...family, group: e.target.value })}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
      </div>

      {/* ✅ Editable members */}
      <div className="member-table">
        <h4>Members ({members.length})</h4>
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Role</th>
              <th>D.O.B</th>
              <th>Gender</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id || i}>
                <td>{i + 1}</td>
                <td>
                  <input
                    value={m.name}
                    onChange={(e) =>
                      setMembers(members.map((mem, idx) =>
                        idx === i ? { ...mem, name: e.target.value } : mem
                      ))
                    }
                  />
                </td>
                <td>
                  <input
                    value={m.role}
                    onChange={(e) =>
                      setMembers(members.map((mem, idx) =>
                        idx === i ? { ...mem, role: e.target.value } : mem
                      ))
                    }
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={m.dob}
                    onChange={(e) =>
                      setMembers(members.map((mem, idx) =>
                        idx === i ? { ...mem, dob: e.target.value } : mem
                      ))
                    }
                  />
                </td>
                <td>
                  <select
                    value={m.gender}
                    onChange={(e) =>
                      setMembers(members.map((mem, idx) =>
                        idx === i ? { ...mem, gender: e.target.value } : mem
                      ))
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
                <td>
                  <input
                    type="tel"
                    value={m.mobile}
                    onChange={(e) =>
                      setMembers(members.map((mem, idx) =>
                        idx === i ? { ...mem, mobile: e.target.value } : mem
                      ))
                    }
                  />
                </td>
                <td>
                  <input
                    type="email"
                    value={m.email}
                    onChange={(e) =>
                      setMembers(members.map((mem, idx) =>
                        idx === i ? { ...mem, email: e.target.value } : mem
                      ))
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(i)}
                    onChange={() => handleSelect(i)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Actions */}
      <div className="actions" style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleRemove}>REMOVE</button>
        <button onClick={handleFinish} disabled={loading}>
          {loading ? "Saving..." : "FINISH"}
        </button>
      </div>
    </motion.div>
  );
}

export default EditFamily;
