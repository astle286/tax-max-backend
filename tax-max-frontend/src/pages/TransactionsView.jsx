import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/TransactionsView.css";
import ErrorPage from "./../components/ErrorPage";
import DeleteTransactionButton from "./../components/DeleteTransactionButton";

function TransactionsView() {
  const { familyId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        // ✅ Fetch transactions from tax-service
        const res = await axios.get(`http://localhost:5003/tax/family/${familyId}`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
        const backendError = err.response?.data;
        setError(backendError || { error: "Fetch Failed", message: "Unexpected error occurred" });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [familyId]);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <ErrorPage error={error.error} message={error.message} />;

  return (
    <motion.div
      className="transactions-view"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="transactions-header">
        <h2>Transactions for Family {familyId}</h2>
        <div className="actions">
          <button className="add-btn">ADD TRANSACTION</button>
          <button className="export-btn">EXPORT</button>
        </div>
      </div>

      <div className="transactions-list">
        <h4>TRANSACTIONS ({transactions.length})</h4>
        {transactions.length === 0 ? (
          <p>No transactions found.</p>
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
                      onDeleted={(id) =>
                        setTransactions(transactions.filter(tx => tx.id !== id))
                      }
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

export default TransactionsView;
