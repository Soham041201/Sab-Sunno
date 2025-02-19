import { Visibility, VisibilityOff } from '@mui/icons-material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import Cookies from 'js-cookie';
import { FunctionComponent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomLoader from '../components/Loader';
import Title from '../components/Title';
import GoogleSignIn from '../functions/authProviders/googleSign';
import { LoginWithEmail } from '../functions/authProviders/login';
import RegisterUsingEmailAndPassword from '../functions/authProviders/register';
import GoogleIcon from '../images/google.svg';
import { setNotification } from '../redux/slice/notificationSlice';
import { setUser } from '../redux/slice/userSlice';
import { uri } from '../config/config';
import NeoPOPButton from '../components/common/NeoPOPButton';

const Login: FunctionComponent = () => {
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [firstName, setFirstName] = useState<string | undefined>();
  const [lastName, setLastName] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const theme = useTheme();
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    GoogleSignIn(async (data) => {
      const userData: any = {
        email: data.email,
        firstName: data.displayName.split(' ')[0],
        lastName: data.displayName.split(' ')[1],
        password: `${
          data.displayName.split(' ')[0] + data.displayName.split(' ')[1]
        }`,
        photoURL: data.photoURL,
      };
      console.log(userData);
      await fetch(`${uri}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsLoading(false);
          dispatch(setUser({ user: data.user }));
          dispatch(
            setNotification({
              message: 'Logged in Successfully',
              type: 'success',
            })
          );

          Cookies.remove('user-token');
          Cookies.remove('isAuthenticated');
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 1 * 7);
          Cookies.set('user-token', data.user._id, {
            expires: expiresAt,
          });
          Cookies.set('isAuthenticated', data.user.isAuthenticated, {
            expires: expiresAt,
          });
          navigate('/authenticate');
        })
        .catch((error) => {
          dispatch(
            setNotification({
              message: 'Oh no! Something went wrong. Please try again',
              type: 'error',
            })
          );
          console.error('Error:', error);
        });
    });
  };

  const handleLogin = async () => {
    if (email && password) {
      LoginWithEmail(email, password, async (user) => {
        setIsLoading(true);
        await fetch(`${uri}/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
                message: 'Logged in Successfully',
                type: 'success',
              })
            );
            navigate('/home');
            console.log(data?.user);
            Cookies.remove('user-token');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1 * 7);
            Cookies.set('user-token', data.user._id, {
              expires: expiresAt,
            });
            Cookies.remove('isAuthenticated');
            Cookies.set('isAuthenticated', data.user.isAuthenticated, {
              expires: expiresAt,
            });
          })
          .catch((error) => {
            dispatch(
              setNotification({
                message: 'Oh no! Something went wrong. Please try again',
                type: 'error',
              })
            );
            console.error('Error:', error);
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
        await fetch(`${uri}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
                message: 'You have been Registered Successfully',
                type: 'success',
              })
            );
            navigate('/home');
            Cookies.remove('user-token');
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 1 * 7);
            Cookies.set('user-token', data.user._id, {
              expires: expiresAt,
            });
            Cookies.set('isAuthenticated', data.user?.isAuthenticated, {
              expires: expiresAt,
            });
          })
          .catch((error) => {
            console.error('Error:', error);
            dispatch(
              setNotification({
                message: 'Oh no! Something went wrong. Please try again',
                type: 'error',
              })
            );
          });
      });
    }
  };

  const buttonBaseStyles = {
    py: 1.5,
    px: 4,
    fontSize: '1rem',
    fontWeight: 600,
    textTransform: 'none',
    borderRadius: '10px',
    boxShadow: 'none',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'scale(1)',
    position: 'relative',
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover::after': {
      opacity: 1,
    },
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '400px',
    bgcolor: 'background.paper',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.15)',
    p: 4,
    borderRadius: 3,
    outline: 'none',
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #fff 0%, #FFF5E9 100%)',
        position: 'relative',
        py: 4,
      }}
    >
      {isLoading && <CustomLoader />}

      <Title />

      <Box
        sx={{
          width: '100%',
          maxWidth: '400px',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#ffffff',
            p: 4,
            borderRadius: '4px',
            boxShadow: `
              4px 4px 0 rgba(0, 0, 0, 0.1),
              8px 8px 20px rgba(255, 132, 19, 0.15)
            `,
            border: '1px solid rgba(0, 0, 0, 0.08)',
          }}
        >
          <NeoPOPButton
            onClick={() => setOpenModal(true)}
            size='large'
            sx={{ width: '100%', mb: 3 }}
          >
            Continue with Email
          </NeoPOPButton>

          <Divider>
            <Typography
              sx={{
                color: 'rgba(0, 0, 0, 0.5)',
                px: 2,
                fontFamily: 'Raleway',
              }}
            >
              or
            </Typography>
          </Divider>

          <NeoPOPButton
            variant='secondary'
            onClick={handleGoogleSignIn}
            icon={
              <Box
                component='img'
                src={GoogleIcon}
                alt='Google'
                sx={{ width: 20, height: 20 }}
              />
            }
            size='large'
            sx={{ width: '100%', mt: 3 }}
          >
            Continue with Google
          </NeoPOPButton>
        </Box>
      </Box>

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby='email-login-modal'
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '440px',
            bgcolor: '#ffffff',
            borderRadius: '4px',
            boxShadow: `
              4px 4px 0 rgba(0, 0, 0, 0.1),
              8px 8px 20px rgba(255, 132, 19, 0.15)
            `,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            p: 4,
            outline: 'none',
          }}
        >
          <Typography
            variant='h5'
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 800,
              color: '#1A1A1A',
              mb: 3,
              position: 'relative',
              display: 'inline-block',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -4,
                left: 0,
                width: '40%',
                height: '3px',
                backgroundColor: theme.palette.primary.main,
                borderRadius: '2px',
              },
            }}
          >
            {!isLogin ? 'Welcome Back' : 'Create Account'}
          </Typography>

          {isLogin && (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}
            >
              <TextField
                label='First Name'
                onChange={(e) => setFirstName(e.target.value)}
                error={Boolean(firstName) && firstName!.length <= 3}
                helperText={
                  firstName && firstName.length <= 3
                    ? 'First Name is too short'
                    : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              />
              <TextField
                label='Last Name'
                onChange={(e) => setLastName(e.target.value)}
                error={Boolean(lastName) && lastName!.length <= 3}
                helperText={
                  lastName && lastName.length <= 3
                    ? 'Last Name is too short'
                    : ''
                }
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: 2,
                      },
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '2px 2px 0 rgba(0, 0, 0, 0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}

          <TextField
            variant='outlined'
            fullWidth
            label='Email'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(email) && email!.length <= 3}
            helperText={email && email.length <= 3 ? 'Email is invalid' : ''}
            sx={{ mt: 2 }}
          />

          <OutlinedInput
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          <NeoPOPButton
            onClick={!isLogin ? handleLogin : handleSignIn}
            size='large'
            sx={{ width: '100%', mt: 3 }}
          >
            {!isLogin ? 'Login' : 'Register'}
          </NeoPOPButton>

          <Box
            sx={{
              mt: 3,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography
              sx={{
                color: 'rgba(0, 0, 0, 0.6)',
                fontFamily: 'Raleway',
              }}
            >
              {!isLogin ? `Don't have an account?` : 'Already have an account?'}
            </Typography>
            <NeoPOPButton
              variant='secondary'
              onClick={() => setIsLogin(!isLogin)}
              size='small'
            >
              {!isLogin ? 'Register' : 'Login'}
            </NeoPOPButton>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default Login;
