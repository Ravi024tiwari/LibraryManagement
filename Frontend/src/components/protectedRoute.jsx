import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * @param {ReactNode} children - protected component
 * @param {string[]} allowedRoles - ["ADMIN"] | ["STUDENT"] | ["ADMIN","STUDENT"]
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  // 🔒 Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role-based protection (optional)
  if (
    allowedRoles &&
    user &&
    !allowedRoles.includes(user.role)
  ) {
    // student trying admin route OR vice versa
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
