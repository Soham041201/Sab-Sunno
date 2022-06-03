import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("user-token");
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
