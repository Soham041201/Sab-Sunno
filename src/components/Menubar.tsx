import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { AppBar, Box, IconButton, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux/slice/themeSlice";
import { setUser, userPictureSelector } from "../redux/slice/userSlice";
import { RootState } from "../redux/store";
import { Theme } from "../types.defined";
import MenuTab from "./MenuTab";
const Menubar: FunctionComponent = () => {
  const photoURL = useSelector(userPictureSelector);
  const dispatch = useDispatch();
  const token = Cookies.get("user-token");
  const isMobile = window.innerWidth < 600;
  const theme = useSelector((state: RootState) => state.theme.theme);

  useEffect(() => {
    if (token) {
      fetch(`https://sab-sunno-backend.herokuapp.com/user/${token}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
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
    <AppBar
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        display: "flex",
        flexDirection: "row",
        p: 2,
        justifyContent: "space-between",
      }}
      position="static"
    >
      <Typography variant={"h2"}>{isMobile ? `Ss.` : `Sab Sunno.`}</Typography>

      <Box
        sx={{
          display: "flex",
        }}
      >
        <IconButton
          onClick={() => {
            if (theme === Theme.light) {
              localStorage.setItem("theme", Theme.dark);
              dispatch(setTheme(Theme.dark));
            } else {
              localStorage.setItem("theme", Theme.light);
              dispatch(setTheme(Theme.light));
            }
          }}
          disableFocusRipple
          disableRipple
        >
          {theme === Theme.light ? (
            <WbSunnyIcon
              sx={{ 
                color: "white",
              }}
            />
          ) : (
            <NightlightIcon />
          )}
        </IconButton>
        <MenuTab src={photoURL} />
      </Box>
    </AppBar>
  );
};
export default Menubar;
