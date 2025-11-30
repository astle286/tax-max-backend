// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";

export default function BackButton({ label = "← Back" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      style={{
        position: "sticky",   // ✅ keeps it fixed relative to the scroll container
        top: 0,               // ✅ sticks to the top
        zIndex: 1000,         // ✅ ensures it stays above other elements
        padding: "8px 16px",
        margin: "0 0 10px 0",
        backgroundColor: "#0077cc",
        border: "1px solid #005fa3",
        borderRadius: "4px",
        cursor: "pointer",
        width: "fit-content"
      }}
    >
      {label}
    </button>
  );
}
