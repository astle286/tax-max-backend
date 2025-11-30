// src/layouts/MainLayout.jsx
import BackButton from "../components/BackButton";

export default function MainLayout({ children }) {
  return (
    <div style={{ padding: "2rem" }}>
      {/* ✅ Universal sticky back button */}
      <div style={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <BackButton label="← Back" />
      </div>

      {/* ✅ Page content */}
      <div>{children}</div>
    </div>
  );
}
