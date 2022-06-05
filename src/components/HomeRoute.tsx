import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const HomeRoute = ({ children }: { children: JSX.Element }) => {
  const token = Cookies.get("user-token");

  return token ? <Navigate to="/home" replace /> : children;
};

export default HomeRoute;
