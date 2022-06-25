import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("user-token");
  const isAuthenticated = Cookies.get("isAuthenticated");
  if (token) {
    if (isAuthenticated === "true") {
      return children;
    }
    return <Navigate to="/authenticate" replace />;
  }
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
