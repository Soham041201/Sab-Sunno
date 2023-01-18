import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import UploadImage from "../functions/dataBase/uploadImage";
import { setNotification } from "../redux/slice/notificationSlice";
import { User } from "../types.defined";
import { uri } from "../config/config";

const Profile = () => {
  const { userId } = useParams();
  const userToken = Cookies.get("user-token");
  const [user, setUser] = useState<User>();
  const isMobile = window.innerWidth < 600;
  const [url, setUrl] = useState<string | undefined>("");
  const [fname, setFname] = useState<string | undefined>("");
  const [lname, setLname] = useState<string | undefined>("");
  const [username, setUsername] = useState<string | undefined>("");
  const [about, setAbout] = useState<string | undefined>("");
  const isSelf = userId === userToken;

  console.log(isSelf);

  const dispatch = useDispatch();
  useEffect(() => {
    if (userId) {
      fetch(`${uri}/user/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            setUser(data?.user);
            setUrl(data?.user?.photoURL);
            setFname(data?.user?.firstName);
            setLname(data?.user?.lastName);
            setUsername(data?.user?.username);
            setAbout(data?.user?.about);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleUpdate = async () => {
    await fetch(`${uri}/user/update/${user?._id}`, {
      method: "PUT",
      body: JSON.stringify({
        username: username,
        photoURL: url,
        firstName: fname,
        lastName: lname,
        about: about,
        password: user?.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data);
          dispatch(
            setNotification({
              message: "Your profile has been updated",
              type: "success",
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      {user && (
        <Box
          sx={{
            m: 1,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
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
              disabled={!isSelf}
            >
              <Avatar
                sx={{
                  m: 2,
                  width: "200px",
                  height: "200px",
                  mx: "auto",
                }}
                src={url ? url : user.photoURL}
              />
              <AddPhotoAlternateIcon
                sx={{
                  fontSize: 48,
                  display: "flex",
                  position: "absolute",
                  color: "gray",
                  opacity: 0.6,
                }}
              />
              <input
                type="file"
                hidden
                onChange={async (e) =>
                  await UploadImage(e, (url) => {
                    setUrl(url);
                  })
                }
                disabled={!isSelf}
              />
            </Button>
            <TextField
              defaultValue={user.username}
              variant={"standard"}
              disabled={!isSelf}
              size={"medium"}
              sx={{
                m: 1,
                width: "200px",
              }}
              label={"Username"}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>

          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Box>
              <TextField
                defaultValue={user.firstName}
                variant={"standard"}
                disabled={!isSelf}
                size={"medium"}
                sx={{
                  m: 1,
                  width: "200px",
                }}
                label={"Firstname"}
                onChange={(e) => setFname(e.target.value)}
              />
              <TextField
                defaultValue={user.lastName}
                variant={"standard"}
                disabled={!isSelf}
                size={"medium"}
                sx={{
                  m: 1,
                  width: "200px",
                }}
                label={"Lastname"}
                onChange={(e) => setLname(e.target.value)}
              />
            </Box>

            <Typography
              variant={"h3"}
              sx={{
                m: 1,
              }}
            >
              {user.email}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
              }}
            >
              <Box sx={{ m: 2 }}>
                <Typography variant={"h2"}>Followers</Typography>
                <Divider
                  sx={{
                    width: "200px",
                  }}
                />
                <Typography variant={"h2"}>0</Typography>
              </Box>
              <Box sx={{ m: 2 }}>
                <Typography variant={"h2"}>Following</Typography>
                <Divider
                  sx={{
                    width: "200px",
                  }}
                />
                <Typography variant={"h2"}>0</Typography>
              </Box>
            </Box>
            <Typography variant={"h2"} sx={{ my: 1 }}>
              About
            </Typography>
            <Divider
              sx={{
                width: "200px",
              }}
            />
            <TextField
              defaultValue={user.about}
              variant={"standard"}
              disabled={!isSelf}
              size={"medium"}
              sx={{
                m: 1,
              }}
              onChange={(e) => setAbout(e.target.value)}
              label={"About"}
            />
          </Box>
        </Box>
      )}
      <Button
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: "white",
          my: 2,
          width: 200,
          mx: "auto",
          borderRadius: "60px",
          "&:hover": {
            backgroundColor: "rgba(248, 248, 248, 0.8)",
          },
        }}
        onClick={handleUpdate}
        disabled={!isSelf}
      >
        <Typography
          sx={{
            color: "black",
            textTransform: "none",
            fontFamily: "Raleway",
          }}
        >
          Save
        </Typography>
      </Button>
    </Container>
  );
};

export default Profile;
