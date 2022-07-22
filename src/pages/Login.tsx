import { Visibility, VisibilityOff } from "@mui/icons-material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import Cookies from "js-cookie";
import { FunctionComponent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../components/Loader";
import Title from "../components/Title";
import GoogleSignIn from "../functions/authProviders/googleSign";
import { LoginWithEmail } from "../functions/authProviders/login";
import RegisterUsingEmailAndPassword from "../functions/authProviders/register";
import GoogleIcon from "../images/google.svg";
import { setNotification } from "../redux/slice/notificationSlice";
import { setUser } from "../redux/slice/userSlice";

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    GoogleSignIn(async (data) => {
      const userData: any = {
        email: data.email,
        firstName: data.displayName.split(" ")[0],
        lastName: data.displayName.split(" ")[1],
        password: `${
          data.displayName.split(" ")[0] + data.displayName.split(" ")[1]
        }`,
        photoURL: data.photoURL,
      };
      console.log(userData);
      await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          dispatch(setUser({ user: data.user }));
          dispatch(
            setNotification({
              message: "Logged in Successfully",
              type: "success",
            })
          );

          Cookies.remove("user-token");
          Cookies.remove("isAuthenticated");
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 1 * 7);
          Cookies.set("user-token", data.user._id, {
            expires: expiresAt,
          });
          Cookies.set("isAuthenticated", data.user.isAuthenticated, {
            expires: expiresAt,
          });
          navigate("/authenticate");
        })
        .catch((error) => {
          dispatch(
            setNotification({
              message: "Oh no! Something went wrong. Please try again",
              type: "error",
            })
          );
          console.error("Error:", error);
        });
    });
  };

  const handleLogin = async () => {
    if (email && password) {
      LoginWithEmail(email, password, async (user) => {
        setIsLoading(true);
        await fetch("http://localhost:8000/user", {
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
            setIsLoading(false);
            dispatch(setUser(data));
            dispatch(
              setNotification({
                message: "Logged in Successfully",
                type: "success",
              })
            );
            navigate("/home");
            console.log(data?.user);
            Cookies.remove("user-token");
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1 * 7);
            Cookies.set("user-token", data.user._id, {
              expires: expiresAt,
            });
            Cookies.remove("isAuthenticated");
            Cookies.set("isAuthenticated", data.user.isAuthenticated, {
              expires: expiresAt,
            });
          })
          .catch((error) => {
            dispatch(
              setNotification({
                message: "Oh no! Something went wrong. Please try again",
                type: "error",
              })
            );
            console.error("Error:", error);
          });
      });
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);

    if (email && password && firstName && lastName) {
      await RegisterUsingEmailAndPassword(email, password, async (user) => {
        const userData = {
          email: email,
          firstName: firstName,
          lastName: lastName,
          password: password,
          isAuthenticated: false,
        };
        await fetch("http://localhost:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
          .then((response) => response.json())
          .then((data: any) => {
            setIsLoading(false);
            console.log(data.user);
            dispatch(setUser(data.user));
            dispatch(
              setNotification({
                message: "You have been Registered Successfully",
                type: "success",
              })
            );
            navigate("/home");
            Cookies.remove("user-token");
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1 * 7);
            Cookies.set("user-token", data.user._id, {
              expires: expiresAt,
            });
            Cookies.set("isAuthenticated", data.user?.isAuthenticated, {
              expires: expiresAt,
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            dispatch(
              setNotification({
                message: "Oh no! Something went wrong. Please try again",
                type: "error",
              })
            );
          });
      });
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {isLoading && <CustomLoader />}
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
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Raleway",
            color: "white",
          }}
        >
          {!isLogin ? `Dont have a account?` : `Already have an account?`}
          <Button
            onClick={() => setIsLogin(!isLogin)}
            sx={{
              m: 0,
              p: 0,
            }}
          >
            <Typography
              display="inline"
              sx={{
                fontFamily: "Raleway",
                textTransform: "none",
                textDecoration: "underline",
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
              type="text"
              error={`${firstName}`.length > 3 ? false : true}
              helperText={
                `${firstName}`.length > 3 ? "" : "First Name is too short"
              }
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
              error={`${lastName}`.length > 3 ? false : true}
              helperText={
                `${lastName}`.length > 3 ? "" : "Last Name is too short"
              }
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
          type="email"
          error={`${email}`.length > 3 ? false : true}
          helperText={`${email}`.length > 3 ? "" : "Email is invalid"}
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
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          size={"small"}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.5)",
            width: "260px",
          }}
          type={showPassword ? "text" : "password"}
          label={"Password"}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                sx={{
                  color: "white",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
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
            mx: "auto",
            my: 1,
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
          startIcon={<img src={GoogleIcon} alt="google-icon" width={24} />}
          onClick={handleGoogleSignIn}
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
