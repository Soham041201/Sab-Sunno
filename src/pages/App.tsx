import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material/";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeRoute from "../components/HomeRoute";
import Menubar from "../components/Menubar";
import Notification from "../components/Notification";
import ProtectedRoute from "../components/ProtectedRoute";
import { setUser } from "../redux/slice/userSlice";
import { RootState } from "../redux/store";
import { darkTheme, lightTheme } from "../style/theme";
import Authenticate from "./Authenticate";
import GetStarted from "./GetStarted";
import Home from "./Home";
import Login from "./Login";
import NotFound from "./NotFound";
import Profile from "./Profile";
import Room from "./Room";
import { uri } from "../config/config";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const token = Cookies.get("user-token");
  const dispatch = useDispatch();
  useEffect(() => {
    if (token) {
      fetch(`${uri}/user/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            data?.user && dispatch(setUser({ user: data.user }));
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
      <Notification />
      <BrowserRouter>
        <Menubar />
        <Routes>
          <Route
            path="/"
            element={
              <HomeRoute>
                <GetStarted />
              </HomeRoute>
            }
          />
          <Route
            path="/authenticate"
            element={
              <HomeRoute>
                <Authenticate />
              </HomeRoute>
            }
          />
          <Route path="/login" element={<Login />} />
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
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
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
