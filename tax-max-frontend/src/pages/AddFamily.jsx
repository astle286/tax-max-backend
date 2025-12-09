import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./../styles/FamilyView.css";
import "./../styles/AddFamily.css";
import ErrorPage from "./../components/ErrorPage";
import BackButton from "../components/BackButton";

function AddFamily() {
  const [familyNumber, setFamilyNumber] = useState("");
  const [familyId, setFamilyId] = useState(null);
  const [group, setGroup] = useState("");
  const [member, setMember] = useState({
    name: "",
    gender: "",
    dob: "",
    role: "",
    mobile: "",
    email: ""
  });
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Toast state
  const [toast, setToast] = useState(null);

  // ✅ Cancel confirmation modal state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // ✅ Create family when group is selected
  useEffect(() => {
    const createFamily = async () => {
      if (!group) return;

      try {
        const res = await axios.post("http://localhost:5002/family", { group });
        setFamilyId(res.data.id);
        setFamilyNumber(res.data.family_number);
        setToast({ type: "success", message: "Family created successfully!" });
      } catch (err) {
        console.error("Failed to create family:", err);
        const backendError = err.response?.data;
        setError(
          backendError || { error: "Create Failed", message: "Unexpected error occurred" }
        );
      }
    };

    createFamily();
  }, [group]);

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    if (
      member.name &&
      member.gender &&
      member.dob &&
      member.role &&
      member.mobile &&
      member.email
    ) {
      setMembers([...members, member]);
      setMember({
        name: "",
        gender: "",
        dob: "",
        role: "",
        mobile: "",
        email: ""
      });
      setToast({ type: "info", message: "Member added to list." });
    }
  };

  const handleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleRemove = () => {
    setMembers(members.filter((_, i) => !selected.includes(i)));
    setSelected([]);
    setToast({ type: "warning", message: "Selected members removed." });
  };

  const handleFinish = async () => {
    setLoading(true);
    setError(null);
    try {
      for (const m of members) {
        await axios.post("http://localhost:5002/family/member", {
          name: m.name,
          gender: m.gender,
          dob: m.dob,
          role: m.role,
          mobile: m.mobile,
          email: m.email,
          family_id: familyId
        });
      }

      setToast({ type: "success", message: "Family and members saved successfully!" });
      setGroup("");
      setMembers([]);
      setFamilyNumber("");
      setFamilyId(null);
    } catch (err) {
      console.error("Failed to save members:", err);
      const backendError = err.response?.data;
      setError(
        backendError || { error: "Save Failed", message: "Unexpected error occurred" }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!familyId) return;
    try {
      await axios.delete(`http://localhost:5002/family/${familyId}`);
      setToast({ type: "error", message: "Family creation cancelled." });
    } catch (err) {
      console.error("Failed to cancel family:", err);
    } finally {
      setGroup("");
      setMembers([]);
      setFamilyNumber("");
      setFamilyId(null);
      setShowCancelConfirm(false);
    }
  };

  if (error) {
    return <ErrorPage error={error.error} message={error.message} />;
  }

  return (
    <motion.div
      className="add-family"
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Add Family</h2>

      {/* ✅ Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      <div className="family-form" style={{ marginBottom: "1rem" }}>
        <input
          placeholder="FAMILY_NUMBER"
          value={familyNumber}
          readOnly
        />
        <select value={group} onChange={(e) => setGroup(e.target.value)}>
          <option value="">Select Group</option>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>

      <div
        className="member-form"
        style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}
      >
        <input
          name="name"
          placeholder="NAME"
          value={member.name}
          onChange={handleChange}
        />
        <select name="gender" value={member.gender} onChange={handleChange}>
          <option value="">GENDER</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          name="dob"
          type="date"
          placeholder="DATE OF BIRTH"
          value={member.dob}
          onChange={handleChange}
        />
        <select name="role" value={member.role} onChange={handleChange}>
          <option value="">ROLE</option>
          <option value="Father">Father</option>
          <option value="Mother">Mother</option>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
        </select>
        <input
          name="mobile"
          type="tel"
          placeholder="MOBILE NUMBER"
          value={member.mobile}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="EMAIL"
          value={member.email}
          onChange={handleChange}
        />
        <button onClick={handleAdd}>ADD MEMBER</button>
      </div>

      <div className="member-table" style={{ marginTop: "2rem" }}>
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
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{m.name}</td>
                <td>{m.role}</td>
                <td>{m.dob}</td>
                <td>{m.gender}</td>
                <td>{m.mobile}</td>
                <td>{m.email}</td>
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

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handleRemove}>REMOVE</button>
        <button onClick={handleFinish} disabled={loading}>
          {loading ? "Saving..." : "FINISH"}
        </button>
        <button 
          onClick={() => setShowCancelConfirm(true)}
          style={{
            backgroundColor: "red",
            color: "white",
            border: "none",
            padding: "0.5rem 1rem",
            cursor: "pointer"
          }}
        >
          CANCEL FAMILY
        </button>
      </div>

      {/* ✅ Cancel Confirmation Modal */}
      {showCancelConfirm && (
  <div className="modal-overlay">
    <div className="modal">
      <h4>Are you sure you want to cancel this family?</h4>
      <p>This will delete the family record from the backend.</p>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        <button
          onClick={async () => {
            await handleCancel();
            setShowCancelConfirm(false);
          }}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Yes, Cancel
        </button>
        <button onClick={() => setShowCancelConfirm(false)}>No, Keep</button>
      </div>
    </div>
  </div>
)}

    </motion.div>
  );
}

export default AddFamily;
