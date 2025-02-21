import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import {
  Avatar,
  Box,
  Container,
  Typography,
  useTheme,
  CircularProgress,
  Badge,
  Grid,
  IconButton,
} from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import UploadImage from '../functions/dataBase/uploadImage';
import { setNotification } from '../redux/slice/notificationSlice';
import { User } from '../types.defined';
import { uri } from '../config/config';
import NeoPOPButton from '../components/common/NeoPOPButton';
import NeoPOPTextField from '../components/common/NeoPOPTextField';
import { selectUser } from '../redux/slice/userSlice';
import { motion } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SchoolIcon from '@mui/icons-material/School';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface ExtendedUser extends User {
  joinedDate?: string;
  location?: string;
  occupation?: string;
  education?: string;
  interests?: string[];
  roomsJoined?: number;
  roomsCreated?: number;
}

const Profile = () => {
  const { userId } = useParams();
  const userToken = Cookies.get('user-token');
  const [user, setUser] = useState<ExtendedUser>();
  const isMobile = window.innerWidth < 600;
  const isSelf = userId === userToken;
  const currentUser = useSelector(selectUser);
  console.log(isSelf);
  console.log(currentUser);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        if (isSelf) {
          setUser(currentUser);
        } else if (userId) {
          const response = await fetch(`${uri}/user/${userId}`);
          const data = await response.json();
          if (data) {
            setUser(data?.user);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [currentUser]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${uri}/user/update/${user?._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user?.username,
          photoURL: user?.photoURL,
          firstName: user?.firstName,
          lastName: user?.lastName,
          about: user?.about,
          password: user?.password,
        }),
      });
      const data = await response.json();
      if (data) {
        dispatch(
          setNotification({
            message: 'Your profile has been updated',
            type: 'success',
          })
        );
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fff 0%, #FFF5E9 100%)',
        }}
      >
        <CircularProgress
          sx={{
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Container
      maxWidth='lg'
      sx={{
        py: { xs: 3, md: 5 },
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fff 0%, #FFF5E9 100%)',
      }}
    >
      {user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              boxShadow: `
                4px 4px 0 rgba(0, 0, 0, 0.1),
                8px 8px 32px rgba(255, 132, 19, 0.15)
              `,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              p: { xs: 3, md: 5 },
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: { xs: 4, md: 6 },
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: isMobile ? '100%' : '320px',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  mb: 4,
                  '&:hover .upload-overlay': {
                    opacity: 1,
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: { xs: 200, md: 260 },
                    height: { xs: 200, md: 260 },
                    border: '4px solid',
                    borderColor: 'rgba(255, 132, 19, 0.2)',
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: isSelf ? 'scale(1.03)' : 'none',
                      boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                  src={user.photoURL}
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
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      opacity: 0,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    <AddPhotoAlternateIcon
                      sx={{
                        fontSize: 56,
                        color: '#ffffff',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.1) rotate(5deg)',
                        },
                      }}
                    />
                    <input
                      type='file'
                      hidden
                      onChange={async (e) =>
                        await UploadImage(e, (url) => {
                          setUser({ ...user, photoURL: url });
                        })
                      }
                      disabled={!isSelf}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ width: '100%', mb: 3 }}>
                <Typography
                  sx={{
                    fontFamily: 'Raleway',
                    fontSize: '0.875rem',
                    color: 'rgba(0, 0, 0, 0.6)',
                    mb: 1,
                    ml: 1,
                  }}
                >
                  Username
                </Typography>
                <NeoPOPTextField
                  value={user.username}
                  disabled={!isSelf}
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1.1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    },
                  }}
                />
              </Box>

              <Box sx={{ width: '100%' }}>
                <Typography
                  sx={{
                    fontFamily: 'Raleway',
                    fontSize: '0.875rem',
                    color: 'rgba(0, 0, 0, 0.6)',
                    mb: 1,
                    ml: 1,
                  }}
                >
                  Email Address
                </Typography>
                <NeoPOPTextField
                  value={user.email}
                  disabled
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&.Mui-disabled': {
                        opacity: 0.8,
                        color: 'rgba(0, 0, 0, 0.7)',
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              sx={{ flex: 1 }}
            >
              <Grid container spacing={3} sx={{ mb: 5 }}>
                <Grid item xs={6} sm={4}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      backgroundColor: 'rgba(255, 132, 19, 0.04)',
                      border: '1px solid rgba(255, 132, 19, 0.1)',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(255, 132, 19, 0.12)',
                      },
                    }}
                  >
                    <Typography
                      variant='h3'
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {user.roomsJoined || 0}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      Rooms Joined
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Box
                    sx={{
                      p: 3,
                      borderRadius: '20px',
                      backgroundColor: 'rgba(255, 132, 19, 0.04)',
                      border: '1px solid rgba(255, 132, 19, 0.1)',
                      textAlign: 'center',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(255, 132, 19, 0.12)',
                      },
                    }}
                  >
                    <Typography
                      variant='h3'
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 700,
                        mb: 1,
                      }}
                    >
                      {user.roomsCreated || 0}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'rgba(0, 0, 0, 0.6)',
                        fontSize: '1rem',
                        fontWeight: 500,
                      }}
                    >
                      Rooms Created
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mb: 5 }}>
                <Typography
                  variant='h5'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 3,
                  }}
                >
                  Personal Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <NeoPOPTextField
                      value={user.firstName}
                      disabled={!isSelf}
                      label='First Name'
                      onChange={(e) =>
                        setUser({ ...user, firstName: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <NeoPOPTextField
                      value={user.lastName}
                      disabled={!isSelf}
                      label='Last Name'
                      onChange={(e) =>
                        setUser({ ...user, lastName: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 5 }}>
                <Typography
                  variant='h5'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 3,
                  }}
                >
                  Additional Information
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <LocationOnIcon
                        sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                      />
                      <NeoPOPTextField
                        value={user.location}
                        disabled={!isSelf}
                        placeholder='Add your location'
                        fullWidth
                        onChange={(e) =>
                          setUser({ ...user, location: e.target.value })
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <WorkIcon
                        sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                      />
                      <NeoPOPTextField
                        value={user.occupation}
                        disabled={!isSelf}
                        placeholder='Add your occupation'
                        fullWidth
                        onChange={(e) =>
                          setUser({ ...user, occupation: e.target.value })
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <SchoolIcon
                        sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                      />
                      <NeoPOPTextField
                        value={user.education}
                        disabled={!isSelf}
                        placeholder='Add your education'
                        fullWidth
                        onChange={(e) =>
                          setUser({ ...user, education: e.target.value })
                        }
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'transparent',
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        p: 2,
                        borderRadius: '12px',
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <DateRangeIcon
                        sx={{ color: theme.palette.primary.main, fontSize: 28 }}
                      />
                      <Typography
                        sx={{
                          color: 'rgba(0, 0, 0, 0.7)',
                          fontWeight: 500,
                          fontSize: '1rem',
                        }}
                      >
                        Joined{' '}
                        {new Date(
                          user.joinedDate || Date.now()
                        ).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ mb: 5 }}>
                <Typography
                  variant='h5'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 3,
                  }}
                >
                  About
                </Typography>

                <NeoPOPTextField
                  value={user.about}
                  disabled={!isSelf}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder='Tell us about yourself...'
                  onChange={(e) => setUser({ ...user, about: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography
                  variant='h5'
                  sx={{
                    fontFamily: 'Raleway',
                    fontWeight: 600,
                    color: '#2C3E50',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Interests
                  {isSelf && (
                    <IconButton
                      size='small'
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 132, 19, 0.08)',
                        },
                      }}
                      onClick={() => {
                        /* Add handler */
                      }}
                    >
                      <EditIcon fontSize='small' />
                    </IconButton>
                  )}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    p: 3,
                    borderRadius: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                  }}
                >
                  {(user.interests || []).map((interest, index) => (
                    <Badge
                      key={index}
                      sx={{
                        '& .MuiBadge-badge': {
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1,
                          borderRadius: '20px',
                          backgroundColor: 'rgba(255, 132, 19, 0.08)',
                          color: theme.palette.primary.main,
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      >
                        {interest}
                      </Box>
                    </Badge>
                  ))}
                  {isSelf &&
                    (!user.interests || user.interests.length === 0) && (
                      <Typography
                        sx={{
                          color: 'rgba(0, 0, 0, 0.4)',
                          fontStyle: 'italic',
                        }}
                      >
                        Add your interests to help others know you better
                      </Typography>
                    )}
                </Box>
              </Box>
            </Box>
          </Box>

          {isSelf && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 5,
                mb: 3,
              }}
            >
              <NeoPOPButton
                onClick={handleUpdate}
                size='large'
                disabled={isSaving}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  position: 'relative',
                  minWidth: '200px',
                }}
              >
                {isSaving ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: 'inherit',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                ) : (
                  'Save Changes'
                )}
              </NeoPOPButton>
            </Box>
          )}
        </motion.div>
      )}
    </Container>
  );
};

export default Profile;
