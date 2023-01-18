import { AppBar, Box, Button, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import {  useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../redux/slice/userSlice";
import MenuTab from "./MenuTab";
const Menubar: FunctionComponent = () => {
  const user = useSelector(selectUser);


  const isMobile = window.innerWidth < 600;
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
        {/* <IconButton
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
        </IconButton> */}
        <MenuTab user={user} />
      </Box>
    </AppBar>
  );
};
export default Menubar;
