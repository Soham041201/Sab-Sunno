import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menubar from "../components/Menubar";
import Notification from "../components/Notification";
import ProtectedRoute from "../components/ProtectedRoute";
import { CssBaseline } from "@mui/material/";
import { lightTheme, darkTheme } from "../style/theme";
import GetStarted from "./GetStarted";
import Home from "./Home";
import Login from "./Login";
import NotFound from "./NotFound";
import Room from "./Room";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import HomeRoute from "../components/HomeRoute";
import Authenticate from "./Authenticate";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { setUser } from "../redux/slice/userSlice";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const token = Cookies.get("user-token");
  const dispatch = useDispatch()
  useEffect(() => {
    if (token) {
      fetch(`http://localhost:8000/user/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            data?.user && dispatch(setUser({ user: data.user }));
            localStorage.setItem("isAuthenticated",data.user.isAuthenticated)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Menubar />
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <HomeRoute>
                <GetStarted />
              </HomeRoute>
            }
          />
          <Route path="/authenticate" element={<Authenticate />} />
          <Route
            path="/login"
            element={
              <HomeRoute>
                <Login />
              </HomeRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room/:roomId"
            element={
              <ProtectedRoute>
                <Room />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
