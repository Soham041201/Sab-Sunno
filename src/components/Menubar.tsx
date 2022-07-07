import NightlightIcon from "@mui/icons-material/Nightlight";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { AppBar, Box, Button, IconButton, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setTheme } from "../redux/slice/themeSlice";
import { selectUser } from "../redux/slice/userSlice";
import { RootState } from "../redux/store";
import { Theme } from "../types.defined";
import MenuTab from "./MenuTab";
const Menubar: FunctionComponent = () => {
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 600;
  const theme = useSelector((state: RootState) => state?.theme.theme);
  const navigate = useNavigate();

  return (
    <AppBar
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
        display: "flex",
        flexDirection: "row",
        p: 1,
        justifyContent: "space-between",
      }}
      position="static"
    >
      <Button onClick={()=>navigate('/home')} sx={{
        textTransform:"none"
      }}>
        <Typography
          variant={"h2"}
          sx={{
            mt: 1,
          }}
        >
          {isMobile ? `Ss.` : `Sab Sunno.`}
        </Typography>
      </Button>

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
        <MenuTab user={user} />
      </Box>
    </AppBar>
  );
};
export default Menubar;
