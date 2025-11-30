import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/FamilyView.css";
import ErrorPage from "./../components/ErrorPage";
import DeleteFamilyButton from "./../components/DeleteFamilyButton";
import DeleteMemberButton from "./../components/DeleteMemberButton";
import DeleteTransactionButton from "./../components/DeleteTransactionButton"; // ✅ fixed import
import { getUserRole } from "./../utils/auth";


function FamilyView() {
  const { familyId } = useParams();
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFamily = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5002/family/${familyId}`);
        setFamily(res.data);
        setMembers(res.data.members);

        // ✅ Later: fetch transactions from tax-service
        // const txRes = await axios.get(`http://localhost:5003/tax/family/${familyId}`);
        // setTransactions(txRes.data);

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

  if (loading) return <p>Loading family...</p>;
  if (error) return <ErrorPage error={error.error} message={error.message} />;

  return (
    <motion.div
      className="family-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Family View</h2>

      <div className="family-header">
        <div className="family-photo">PHOTO</div>
        <div>
          <strong>FAMILY_ID:</strong> {family.id}<br />
          <strong>GROUP:</strong> {family.group}
        </div>
      </div>

      {/* ✅ Action buttons */}
      <div className="family-actions" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {(getUserRole() === "admin" || getUserRole() === "staff") && (
        <button
          className="edit-family-btn"
          onClick={() => navigate(`/edit-family/${family.id}`)}
        >
          ✏️ Edit Family
        </button>
      )}
        <DeleteFamilyButton familyId={family.id} />
      </div>

      <div className="members-list">
        <h4>MEMBERS</h4>
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr key={m.id}>
                <td>{i + 1}</td>
                <td>
                  <button
                    className="member-link"
                    onClick={() => navigate(`/member/${m.id}`)}
                  >
                    {m.name}
                  </button>
                </td>
                <td>{m.role}</td>
                <td>{m.dob}</td>
                <td>{m.gender}</td>
                <td>{m.mobile}</td>
                <td>{m.email}</td>
                <td>
                  <DeleteMemberButton
                    memberId={m.id}
                    onDeleted={(id) => setMembers(members.filter(mem => mem.id !== id))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="transactions">
        <h4>TRANSACTIONS</h4>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Details</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.details}</td>
                  <td>{t.amount}</td>
                  <td>{t.date}</td>
                  <td><a href={t.receipt}>Download</a></td>
                  <td>
                    <DeleteTransactionButton
                      transactionId={t.id}
                      onDeleted={(id) => setTransactions(transactions.filter(tx => tx.id !== id))}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

export default FamilyView;
