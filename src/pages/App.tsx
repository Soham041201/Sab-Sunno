import { ThemeProvider } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menubar from "../components/Menubar";
import Notification from "../components/Notification";
import ProtectedRoute from "../components/ProtectedRoute";
import theme from "../style/theme";
import GetStarted from "./GetStarted";
import Home from "./Home";
import Login from "./Login";
import NotFound from "./NotFound";
import Room from "./Room";

function App() {
  return (
    <ThemeProvider theme={theme}>
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
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
