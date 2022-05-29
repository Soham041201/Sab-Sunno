import { ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Menubar from "../components/Menubar";
import { store } from "../redux/store";
import theme from "../style/theme";
import GetStarted from "./GetStarted";
import Home from "./Home";
import Login from "./Login";
import Room from "./Room";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Menubar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/room/:roomId" element={<Room />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
