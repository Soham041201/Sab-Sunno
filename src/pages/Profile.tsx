import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Avatar, Box, Container, Typography, useTheme } from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import UploadImage from '../functions/dataBase/uploadImage';
import { setNotification } from '../redux/slice/notificationSlice';
import { User } from '../types.defined';
import { uri } from '../config/config';
import NeoPOPButton from '../components/common/NeoPOPButton';
import NeoPOPTextField from '../components/common/NeoPOPTextField';

const Profile = () => {
  const { userId } = useParams();
  const userToken = Cookies.get('user-token');
  const [user, setUser] = useState<User>();
  const isMobile = window.innerWidth < 600;
  const [url, setUrl] = useState<string | undefined>('');
  const [fname, setFname] = useState<string | undefined>('');
  const [lname, setLname] = useState<string | undefined>('');
  const [username, setUsername] = useState<string | undefined>('');
  const [about, setAbout] = useState<string | undefined>('');
  const isSelf = userId === userToken;

  console.log(isSelf);

  const dispatch = useDispatch();
  const theme = useTheme();

  useEffect(() => {
    if (userId) {
      fetch(`${uri}/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
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
          console.error('Error:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = async () => {
    await fetch(`${uri}/user/update/${user?._id}`, {
      method: 'PUT',
      body: JSON.stringify({
        username: username,
        photoURL: url,
        firstName: fname,
        lastName: lname,
        about: about,
        password: user?.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log(data);
          dispatch(
            setNotification({
              message: 'Your profile has been updated',
              type: 'success',
            })
          );
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <Container
      maxWidth='lg'
      sx={{
        py: 4,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff 0%, #FFF5E9 100%)',
      }}
    >
      {user && (
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: `
              4px 4px 0 rgba(0, 0, 0, 0.1),
              8px 8px 20px rgba(255, 132, 19, 0.15)
            `,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            p: { xs: 2, md: 4 },
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: isMobile ? '100%' : '300px',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                mb: 3,
                '&:hover .upload-overlay': {
                  opacity: 1,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 200,
                  height: 200,
                  border: '4px solid',
                  borderColor: 'rgba(255, 132, 19, 0.2)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
                }}
                src={url || user.photoURL}
              />
              {isSelf && (
                <Box
                  className='upload-overlay'
                  component='label'
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  <AddPhotoAlternateIcon
                    sx={{
                      fontSize: 48,
                      color: '#ffffff',
                    }}
                  />
                  <input
                    type='file'
                    hidden
                    onChange={async (e) =>
                      await UploadImage(e, (url) => {
                        setUrl(url);
                      })
                    }
                    disabled={!isSelf}
                  />
                </Box>
              )}
            </Box>

            <NeoPOPTextField
              value={username}
              disabled={!isSelf}
              label='Username'
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                maxWidth: '280px',
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                mb: 4,
              }}
            >
              <NeoPOPTextField
                value={fname}
                disabled={!isSelf}
                label='First Name'
                onChange={(e) => setFname(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: '200px',
                }}
              />
              <NeoPOPTextField
                value={lname}
                disabled={!isSelf}
                label='Last Name'
                onChange={(e) => setLname(e.target.value)}
                sx={{
                  flex: 1,
                  minWidth: '200px',
                }}
              />
            </Box>

            <Typography
              sx={{
                fontFamily: 'Raleway',
                fontSize: '1.1rem',
                color: 'rgba(0, 0, 0, 0.6)',
                mb: 4,
              }}
            >
              {user.email}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                mb: 4,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  minWidth: '200px',
                  p: 3,
                  backgroundColor: 'rgba(255, 132, 19, 0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 132, 19, 0.1)',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 1,
                  }}
                >
                  Followers
                </Typography>
                <Typography
                  variant='h4'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                  }}
                >
                  0
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  minWidth: '200px',
                  p: 3,
                  backgroundColor: 'rgba(255, 132, 19, 0.04)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 132, 19, 0.1)',
                }}
              >
                <Typography
                  variant='h6'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 1,
                  }}
                >
                  Following
                </Typography>
                <Typography
                  variant='h4'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 800,
                    color: theme.palette.primary.main,
                  }}
                >
                  0
                </Typography>
              </Box>
            </Box>

            <Typography
              variant='h6'
              sx={{
                fontFamily: 'Raleway',
                fontWeight: 600,
                color: '#2C3E50',
                mb: 2,
              }}
            >
              About
            </Typography>

            <NeoPOPTextField
              value={about}
              disabled={!isSelf}
              multiline
              rows={4}
              fullWidth
              placeholder='Tell us about yourself...'
              onChange={(e) => setAbout(e.target.value)}
            />
          </Box>
        </Box>
      )}

      {isSelf && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <NeoPOPButton onClick={handleUpdate} size='large'>
            Save Changes
          </NeoPOPButton>
        </Box>
      )}
    </Container>
  );
};

export default Profile;
