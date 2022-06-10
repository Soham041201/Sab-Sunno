import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { userAuthenticationSelector } from "../redux/slice/userSlice";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("user-token");
  const isAuthenticated = useSelector(userAuthenticationSelector);
  console.log(isAuthenticated);
  if (token && !isAuthenticated) {
    return <Navigate to="/authenticate" replace />;
  } else if (token && isAuthenticated) {
    return children;
  }
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
