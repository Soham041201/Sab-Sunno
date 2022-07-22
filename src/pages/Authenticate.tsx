import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Avatar,
  Box,
  Button,
  colors,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { FunctionComponent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UploadImage from "../functions/dataBase/uploadImage";
import { setNotification } from "../redux/slice/notificationSlice";
import { userPictureSelector } from "../redux/slice/userSlice";

const Authenticate: FunctionComponent = () => {
  const photoURL = useSelector(userPictureSelector);
  const [url, setUrl] = useState<string | undefined>(photoURL);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userName, setUserName] = useState<string | undefined>();
  const token = Cookies.get("user-token");
  return (
    <>
      <Box
        component={"div"}
        sx={{
          width: "500px",
          mx: "auto",
          my: 10,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "20px",
          display: "flex",
          height: { sx: "80vh", sm: "80vh", md: 360, lg: 345 },
          overflow: "auto",
          justifyContent: "center",
          flexDirection: "column",
          p: 1,
        }}
      >
        <Typography
          variant={"h3"}
          sx={{
            textTransform: "none",
            textAlign: "center",
          }}
        >
          Choose a display picture
        </Typography>
        <Button
          variant={"text"}
          component="label"
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
          disableElevation
          disableFocusRipple
          disableTouchRipple
        >
          <Avatar
            sx={{
              height: 100,
              width: 100,
              mx: "auto",
              my: 2,
            }}
            src={url}
          >
            <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
          </Avatar>

          <input
            type="file"
            hidden
            onChange={async (e) =>
              await UploadImage(e, (url) => {
                setUrl(url);
              })
            }
          />
        </Button>

        <Typography
          variant={"body2"}
          sx={{
            textTransform: "none",
            textAlign: "center",
          }}
        >
          Choose a catchy username
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <Typography
            variant={"h2"}
            sx={{
              mb: 1,
              mx: 1,
              borderRadius: "5px",
              p: 0.5,
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              height: "35px",
              color: colors.grey,
            }}
          >
            @
          </Typography>
          <TextField
            variant="outlined"
            size={"small"}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              my: 1,
              width: "200px",
              p: 0,
            }}
            label={
              <Typography
                sx={{
                  fontFamily: "Raleway",
                  color: "white",
                }}
              >
                Username
              </Typography>
            }
            onChange={(e) => setUserName(e.target.value)}
          />
        </Box>
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "white",
            mx: "auto",
            my: 2,
            width: 200,
            borderRadius: "60px",
            "&:hover": {
              backgroundColor: "rgba(248, 248, 248, 0.8)",
            },
          }}
          onClick={async () => {
            await fetch(`https://sab-sunno-backend.herokuapp.com/user/${token}`, {
              method: "PUT",
              body: JSON.stringify({
                username: userName,
                photoURL: url,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then((response) => response.json())
              .then((data) => {
                if (data) {
                  dispatch(
                    setNotification({
                      message: "Welcome to Sab Sunno!",
                      type: "success",
                    })
                  );
                  Cookies.remove("isAuthenticated");
                  Cookies.set("isAuthenticated", data?.user?.isAuthenticated);
                  navigate("/home");
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
          }}
        >
          <Typography
            sx={{
              color: "black",
              textTransform: "none",
              fontFamily: "Raleway",
              fontWeight: "bold",
            }}
          >
            Get Started
          </Typography>
          <NavigateNextIcon
            sx={{
              color: "black",
            }}
          />
        </Button>
      </Box>
    </>
  );
};

export default Authenticate;
