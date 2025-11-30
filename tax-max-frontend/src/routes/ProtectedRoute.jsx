import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

function ProtectedRoute({ children, role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (role) {
    const allowedRoles = role.split(",").map(r => r.trim().toLowerCase());
    const currentRole = getUserRole()?.toLowerCase();

    if (!allowedRoles.includes(currentRole)) {
      return <Navigate to="/login" />;
    }
  }

  return children;
}

export default ProtectedRoute;
