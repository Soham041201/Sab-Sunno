import { AppBar, Avatar, Box, TextField, Typography } from "@mui/material";
import { FunctionComponent } from "react";

const Menubar: FunctionComponent = () => {
  // const photoURL = useSelector(userPictureSelector);
  // const firstName = useSelector(userNameSelector);
  let user = localStorage.getItem("user");
  const userData = JSON.parse(user as string);
  console.log(userData);
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
        <Avatar src={userData?.photoURL} />
        <Typography
          variant={"h3"}
          sx={{
            p: 1,
          }}
        >
          {userData?.firstName}
        </Typography>
      </Box>
    </AppBar>
  );
};
export default Menubar;
