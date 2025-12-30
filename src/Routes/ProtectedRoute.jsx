import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  
  let user = null;
  if (userData) {
    try {
      user = JSON.parse(userData);
    } catch (error) {
      // Invalid JSON in localStorage, treat as no user
      console.error("Error parsing user data from localStorage:", error);
      user = null;
    }
  }

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}