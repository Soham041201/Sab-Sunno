import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const HomeRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("user-token");
  const isAuthenticated = Cookies.get("isAuthenticated");

  console.log(token && isAuthenticated);
  if (token && isAuthenticated === "false") {
    return children;
  }
  return <Navigate to="/home" replace />;
};

export default HomeRoute;
