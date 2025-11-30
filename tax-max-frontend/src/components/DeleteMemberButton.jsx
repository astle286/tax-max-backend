import { useState } from "react";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";

function DeleteMemberButton({ memberId, onDeleted }) {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5002/family/member/${memberId}`);
      alert("Member deleted successfully!");
      if (onDeleted) onDeleted(memberId); // ✅ callback to refresh parent list
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
        DELETE MEMBER
      </button>

      {showModal && (
        <ConfirmationModal
          title="Confirm Member Deletion"
          message="Are you sure you want to delete this member? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default DeleteMemberButton;
