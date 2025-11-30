import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

function DeleteFamilyButton({ familyId }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5002/family/${familyId}`);
      alert("Family deleted successfully!");
      navigate("/family-records");
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
        DELETE FAMILY
      </button>

      {showModal && (
        <ConfirmationModal
          title="Confirm Family Deletion"
          message="Are you sure you want to delete this family? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default DeleteFamilyButton;
