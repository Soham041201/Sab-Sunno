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
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function App() {
  const theme = useSelector((state: RootState) => state.theme.theme);
  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <CssBaseline />
      <Menubar />
      <Notification />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GetStarted />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
