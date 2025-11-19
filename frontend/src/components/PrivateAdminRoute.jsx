import { Navigate } from "react-router-dom";

export default function PrivateAdminRoute({ children }) {
  const role = localStorage.getItem("role");

  // ❌ Not admin → redirect to login
  if (role !== "admin") {
    return <Navigate to="/auth" replace />;
  }

  // ✅ Allow admin page
  return children;
}
