import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/EditTransaction.css";
import ErrorPage from "./../components/ErrorPage";

function EditTransaction() {
  const { transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5003/tax/transaction/${transactionId}`);
        setTransaction(res.data);
      } catch (err) {
        console.error("Failed to fetch transaction:", err);
        const backendError = err.response?.data;
        setError(backendError || { error: "Fetch Failed", message: "Unexpected error occurred" });
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleChange = (e) => {
    setTransaction({ ...transaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`http://localhost:5003/tax/transaction/${transactionId}`, {
        details: transaction.details,
        amount: parseFloat(transaction.amount),
        date: transaction.date,
        receipt: transaction.receipt
      });

      alert("Transaction updated successfully!");
    } catch (err) {
      console.error("Failed to update transaction:", err);
      const backendError = err.response?.data;
      setError(backendError || { error: "Update Failed", message: "Unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading transaction...</p>;
  if (error) return <ErrorPage error={error.error} message={error.message} />;

  return (
    <motion.div
      className="edit-transaction"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <h2>Edit Transaction</h2>

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

        <div className="actions">
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "UPDATE TRANSACTION"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default EditTransaction;
