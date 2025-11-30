import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "./../styles/AddTransaction.css";
import ErrorPage from "./../components/ErrorPage";

function AddTransaction({ familyId, onAdded }) {
  const [transaction, setTransaction] = useState({
    details: "",
    amount: "",
    date: "",
    receipt: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!transaction.details || !transaction.amount || !transaction.date) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:5003/tax/transaction", {
        family_id: familyId,
        details: transaction.details,
        amount: parseFloat(transaction.amount),
        date: transaction.date,
        receipt: transaction.receipt
      });

      alert("Transaction added successfully!");
      setTransaction({ details: "", amount: "", date: "", receipt: "" });

      if (onAdded) onAdded(res.data);
    } catch (err) {
      console.error("Failed to add transaction:", err);
      const backendError = err.response?.data;
      setError(backendError || { error: "Save Failed", message: "Unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <ErrorPage error={error.error} message={error.message} />;
  }

  return (
    <motion.div
      className="add-transaction"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Add Transaction</h2>

      <div className="transaction-form">
        <input
          name="details"
          placeholder="DETAILS"
          value={transaction.details}
          onChange={handleChange}
        />
        <input
          name="amount"
          type="number"
          placeholder="AMOUNT"
          value={transaction.amount}
          onChange={handleChange}
        />
        <input
          name="date"
          type="date"
          value={transaction.date}
          onChange={handleChange}
        />
        <input
          name="receipt"
          placeholder="RECEIPT URL"
          value={transaction.receipt}
          onChange={handleChange}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "ADD TRANSACTION"}
        </button>
      </div>
    </motion.div>
  );
}

export default AddTransaction;
