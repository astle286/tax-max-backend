import { useState } from "react";
import { motion } from "framer-motion";
import "./../styles/FamilyView.css";

function FamilyViewViewer() {
  const [familyId] = useState("FAM001");
  const [group] = useState("Group A");
  const [members] = useState([
    { name: "Alice", dob: "2000-01-01", tag: "Adult" },
    { name: "Bob", dob: "2010-05-12", tag: "Child" },
    { name: "Carol", dob: "1955-08-20", tag: "Senior" }
  ]);
  const [transactions] = useState([
    { details: "Food Pack", amount: 500, date: "2025-11-01", receipt: "#" },
    { details: "Medical Aid", amount: 1200, date: "2025-11-15", receipt: "#" }
  ]);

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
          <strong>FAMILY_ID:</strong> {familyId}<br />
          <strong>GROUP:</strong> {group}
        </div>
      </div>

      <div className="members-list">
        <h4>MEMBERS</h4>
        <ul>
          {members.map((m, i) => (
            <li key={i}>
              {i + 1}. {m.name} — {m.dob} — {m.tag}
            </li>
          ))}
        </ul>
      </div>

      <div className="transactions">
        <h4>TRANSACTIONS</h4>
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
      </div>
    </motion.div>
  );
}

export default FamilyViewViewer;
