import { useState } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";

function DeleteTransactionButton({ transactionId, onDeleted }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      // ✅ Call your tax-service delete endpoint
      await axios.delete(`http://localhost:5003/tax/transaction/${transactionId}`);
      alert("Transaction deleted successfully!");
      if (onDeleted) onDeleted(transactionId); // callback to refresh parent list
    } catch (err) {
      console.error("Delete failed:", err);
      alert(err.response?.data?.error || "Unexpected error occurred");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <button className="delete-btn" onClick={() => setShowModal(true)}>
        DELETE TRANSACTION
      </button>

      {showModal && (
        <ConfirmationModal
          title="Confirm Transaction Deletion"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default DeleteTransactionButton;
