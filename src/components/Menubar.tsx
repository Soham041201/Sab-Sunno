import { AppBar, Box, TextField, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, userPictureSelector } from "../redux/slice/userSlice";
import { RootState } from "../redux/store";
import MenuTab from "./MenuTab";

const Menubar: FunctionComponent = () => {
  const photoURL = useSelector(userPictureSelector);
  const dispatch = useDispatch();
  const token = Cookies.get("user-token");
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
            console.log(data);
            dispatch(setUser({ user: data.user }));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
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
      <Typography variant={"h2"}>Sab Sunno.</Typography>

      <Box
        sx={{
          display: "flex",
        }}
      >
        <TextField
          size="small"
          variant="outlined"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            mx: 1,
            width: "200px",
          }}
          label={<Typography variant={"h3"}>Search</Typography>}
        />
        <MenuTab src={photoURL} />
      </Box>
    </AppBar>
  );
};
export default Menubar;
