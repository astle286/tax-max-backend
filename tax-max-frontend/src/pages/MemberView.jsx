import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/MemberView.css";
import "./../styles/FamilyView.css";
import ErrorPage from "./../components/ErrorPage";
import DeleteMemberButton from "./../components/DeleteMemberButton";

function MemberView() {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [transactions, setTransactions] = useState([]); // later from tax-service
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5002/family/member/${memberId}`);
        setMember(res.data);
      } catch (err) {
        console.error("Failed to fetch member:", err);
        const backendError = err.response?.data;
        setError(backendError || { error: "Fetch Failed", message: "Unexpected error occurred" });
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  if (loading) return <p>Loading member...</p>;
  if (error) return <ErrorPage error={error.error} message={error.message} />;

  return (
    <motion.div
      className="member-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Member View</h2>

      <div className="member-header">
        <div className="member-photo">PHOTO</div>
        <div className="meta">
          <strong>NAME:</strong> {member.name}<br />
          <strong>D.O.B:</strong> {member.dob}<br />
          <strong>ROLE:</strong> {member.role}<br />
          <strong>GENDER:</strong> {member.gender}<br />
          <strong>MOBILE:</strong> {member.mobile}<br />
          <strong>EMAIL:</strong> {member.email}<br />
          <strong>MEMBER_ID:</strong> {member.id}<br />
          <strong>FAMILY_NUMBER:</strong> {member.family_number}<br />
          <strong>FAMILY_ID:</strong>{" "}
          <button className="family-link" onClick={() => navigate(`/family/${member.family_id}`)}>
            {member.family_id}
          </button>
        </div>
      </div>

      <DeleteMemberButton
        memberId={member.id}
        onDeleted={() => navigate(`/family/${member.family_id}`)}
      />

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
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{t.details}</td>
                  <td>{t.amount}</td>
                  <td>{t.date}</td>
                  <td><a href={t.receipt}>Download</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
}

export default MemberView;
