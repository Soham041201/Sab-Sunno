import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Container, TextField,
  Typography
} from "@mui/material";
import { FunctionComponent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import GoogleSignIn from "../functions/authProviders/googleSign";
import { LoginWithEmail } from "../functions/authProviders/login";
import RegisterUsingEmailAndPassword from "../functions/authProviders/register";
import UploadImage from "../functions/dataBase/uploadImage";
import GoogleIcon from "../images/google.svg";

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [userName, setUserName] = useState<string | undefined>();
  const [url, setUrl] = useState<string | undefined>();

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleLogin = async () => {
    if (email && password) {
      LoginWithEmail(email, password, async (user) => {
        console.log(user);
        await fetch("http://localhost:8000/getUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            localStorage.setItem("user", JSON.stringify(data));
            console.log(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        if (user) {
          navigate("/home");
        }
      });
    }
  };

  const handleSignIn = async () => {
    if (email && password) {
      await RegisterUsingEmailAndPassword(email, password, async (user) => {
        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
          photoURL: url,
          username: userName,
        };
        console.log(JSON.stringify(userData));
        await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/home");
      });
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          my: 5,
        }}
      >
        <Title />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          mx: "auto",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Raleway",
            color: "white",
          }}
        >
          {!isLogin ? `Dont have a account?` : `Already have an account?`}
          <Button onClick={() => setIsLogin(!isLogin)}>
            <Typography
              display="inline"
              sx={{
                fontFamily: "Raleway",
                textTransform: "none",
                color: "#07F0FF",
                fontWeight: "bold",
              }}
            >
              {!isLogin ? `Register` : `Login`}
            </Typography>
          </Button>
        </Typography>

        {isLogin && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              variant="outlined"
              size={"small"}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                my: 1,
                width: "260px",
              }}
              label={
                <Typography
                  sx={{
                    fontFamily: "Raleway",
                    color: "white",
                  }}
                >
                  FirstName
                </Typography>
              }
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              variant="outlined"
              size={"small"}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                my: 1,
                width: "260px",
              }}
              label={
                <Typography
                  sx={{
                    fontFamily: "Raleway",
                    color: "white",
                  }}
                >
                  LastName
                </Typography>
              }
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              variant="outlined"
              size={"small"}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                my: 1,
                width: "260px",
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
            <Button variant={"contained"} component="label">
              Upload Image
              <input
                hidden
                type="file"
                onChange={async (e) =>
                  await UploadImage(e, (url) => {
                    setUrl(url);
                  })
                }
              />
            </Button>
          </Box>
        )}
        <TextField
          variant="outlined"
          size={"small"}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            my: 1,
            width: "260px",
          }}
          label={
            <Typography
              sx={{
                fontFamily: "Raleway",
                color: "white",
              }}
            >
              Email
            </Typography>
          }
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          size={"small"}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            width: "260px",
          }}
          label={
            <Typography
              sx={{
                fontFamily: "Raleway",
                color: "white",
              }}
            >
              Password
            </Typography>
          }
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "white",
            my: 2,
            mx: "auto",
            width: 200,
            borderRadius: "60px",
            "&:hover": {
              backgroundColor: "rgba(248, 248, 248, 0.8)",
            },
          }}
          onClick={!isLogin ? handleLogin : handleSignIn}
        >
          <Typography
            sx={{
              color: "black",
              textTransform: "none",
              fontFamily: "Raleway",
            }}
          >
            {!isLogin ? "Login" : "Register"}
          </Typography>
          <NavigateNextIcon
            sx={{
              color: "black",
            }}
          />
        </Button>
        <Typography
            sx={{
              color: "black",
              textTransform: "none",
              fontFamily: "Raleway",
              mx:'auto',
              my:1
            }}
          >
        or
          </Typography>
        <Button
          variant="contained"
          disableElevation
          sx={{
            backgroundColor: "white",
          
            mx: "auto",
            width: 230,
            borderRadius: "60px",
            "&:hover": {
              backgroundColor: "rgba(248, 248, 248, 0.8)",
            },
          }}
          startIcon={
            <img src={GoogleIcon} alt="google-icon" width={24} />
          }
          onClick={() => {
            GoogleSignIn(async (data) => {
              const userData = {
                email: data.email,
                firstName: data.displayName,
                lastName: "",
                password: "",
                photoURL: data.photoURL,
                username: data.displayName,
              };
              const userInfo = JSON.stringify(userData)
              await fetch("http://localhost:8000/register", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((response) => response.json())
                .then((data) => {
                  localStorage.setItem("isAuth", "true");
                  localStorage.setItem("user", userInfo);
                  navigate("/home");
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
         
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
            Login with Google
          </Typography>
          <NavigateNextIcon
            sx={{
              color: "black",
            }}
          />
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
