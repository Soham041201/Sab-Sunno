import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ShareIcon from '@mui/icons-material/Share';
import {
  Avatar,
  Badge,
  Box,
  Container,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useTheme,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useWebRTC } from '../hooks/useWebRTC';
import muteIcon from '../images/mute.png';
import { setNotification } from '../redux/slice/notificationSlice';
import { selectUser } from '../redux/slice/userSlice';
import { RoomUser } from '../types.defined';
import { uri } from '../config/config';
import NeoPOPButton from '../components/common/NeoPOPButton';
import RoomChat from '../components/RoomChat';
import AudioVisualizer from '../components/AudioVisualizer';

const Room: FunctionComponent = () => {
  const { roomId } = useParams();
  const user = useSelector(selectUser);
  const [room, setRoom] = useState<any>({});
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<
    Array<{ text: string; timestamp: Date }>
  >([]);

  const copy = () => {
    const el = document.createElement('input');
    el.value =
      'Join me and my friends having a amazing conversation at ' +
      window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    dispatch(
      setNotification({ type: 'success', message: 'Link copied to clipboard' })
    );
  };

  useEffect(() => {
    fetch(`${uri}/room/${roomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setRoom(data.room);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [roomId]);

  useEffect(() => {
    handleMute(user._id, isMuted, roomId);
  }, [isMuted, user._id, roomId, handleMute]);

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, timestamp: new Date() }]);
      setMessage('');
    }
  };

  return (
    <Container
      maxWidth='xl'
      sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, md: 4 },
        backgroundColor: '#fafafa',
      }}
    >
      <Box sx={{ paddingRight: isChatOpen ? '320px' : '40px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <NeoPOPButton
            variant='secondary'
            icon={<ArrowBackIcon />}
            onClick={() => navigate('/home')}
            size='small'
          >
            Back to Rooms
          </NeoPOPButton>

          <NeoPOPButton icon={<ShareIcon />} onClick={copy} size='small'>
            Invite Friends
          </NeoPOPButton>
        </Box>

        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            maxWidth: '1200px',
          }}
        >
          <Box
            sx={{
              mb: 4,
              position: 'relative',
              maxWidth: '800px',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                mb: 3,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -8,
                  left: 0,
                  width: 80,
                  height: 4,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: '2px',
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontFamily: 'Raleway',
                  fontWeight: 800,
                  color: '#000000',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                }}
              >
                {room.roomName ? (
                  room.roomName
                ) : (
                  <Skeleton
                    width='60%'
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: '1.1rem',
                color: 'rgba(0, 0, 0, 0.7)',
                fontFamily: 'Raleway',
                fontWeight: 500,
                maxWidth: '600px',
                lineHeight: 1.5,
                pl: 0.5,
                borderLeft: (theme) =>
                  `3px solid ${theme.palette.primary.main}`,
                opacity: 0.85,
              }}
            >
              {room.roomDescription ? (
                room.roomDescription
              ) : (
                <Skeleton
                  width='100%'
                  sx={{
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    borderRadius: '2px',
                  }}
                />
              )}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: '#ffffff',
              p: 4,
              borderRadius: '2px',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              boxShadow: `
                4px 4px 0 rgba(0, 0, 0, 0.2),
                8px 8px 0 rgba(255, 132, 19, 0.2)
              `,
              height: { xs: 'auto', md: '400px' },
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(0, 0, 0, 0.05)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: theme.palette.primary.main,
                borderRadius: '2px',
              },
            }}
          >
            <Grid container spacing={3}>
              {clients?.map((client: RoomUser) => (
                <Grid item xs={6} sm={4} md={3} key={client._id}>
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => navigate(`/profile/${client._id}`)}
                  >
                    <audio
                      autoPlay
                      ref={(instance) => {
                        provideRef(instance, client._id);
                      }}
                    />
                    <Box sx={{ position: 'relative' }}>
                      {!client.isMuted && (
                        <AudioVisualizer
                          audioRef={
                            provideRef(
                              null,
                              client._id
                            ) as unknown as HTMLAudioElement
                          }
                          size={80}
                          color={theme.palette.primary.main}
                        />
                      )}
                      <Badge
                        overlap='circular'
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        badgeContent={
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              backgroundColor: 'transparent',
                            }}
                            src={muteIcon}
                            variant='circular'
                          />
                        }
                        invisible={!client.isMuted}
                      >
                        <Avatar
                          src={client?.photoURL}
                          sx={{
                            width: 64,
                            height: 64,
                            border: '2px solid #ffffff',
                            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.12)',
                            position: 'relative',
                            zIndex: 1,
                          }}
                        />
                      </Badge>
                    </Box>

                    <Typography
                      sx={{
                        mt: 2,
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: 'rgba(0, 0, 0, 0.85)',
                      }}
                    >
                      {client.username}
                    </Typography>

                    {room?.createdBy?._id === client?._id && (
                      <Box
                        sx={{
                          mt: 1,
                          px: 2,
                          py: 0.5,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '2px',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#ffffff',
                            fontWeight: 600,
                          }}
                        >
                          Host
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              mt: 4,
            }}
          >
            <IconButton
              onClick={() => setIsMuted(!isMuted)}
              sx={{
                p: 2,
                backgroundColor: isMuted
                  ? theme.palette.error.main
                  : theme.palette.primary.main,
                borderRadius: '2px',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                boxShadow: `
                  2px 2px 0 rgba(0, 0, 0, 0.2),
                  4px 4px 0 ${
                    isMuted
                      ? 'rgba(211, 47, 47, 0.3)'
                      : 'rgba(255, 132, 19, 0.3)'
                  }
                `,
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isMuted
                    ? theme.palette.error.dark
                    : '#FF7F50',
                  transform: 'translate(-2px, -2px)',
                  boxShadow: `
                    4px 4px 0 rgba(0, 0, 0, 0.2),
                    6px 6px 0 ${
                      isMuted
                        ? 'rgba(211, 47, 47, 0.3)'
                        : 'rgba(255, 127, 80, 0.3)'
                    }
                  `,
                },
                '&:active': {
                  transform: 'translate(2px, 2px)',
                  boxShadow: `
                    1px 1px 0 rgba(0, 0, 0, 0.2),
                    2px 2px 0 ${
                      isMuted
                        ? 'rgba(211, 47, 47, 0.3)'
                        : 'rgba(255, 132, 19, 0.3)'
                    }
                  `,
                },
              }}
            >
              {!isMuted ? (
                <MicIcon sx={{ fontSize: 28, color: '#ffffff' }} />
              ) : (
                <MicOffIcon sx={{ fontSize: 28, color: '#ffffff' }} />
              )}
            </IconButton>
          </Box>
        </Container>
      </Box>

      <RoomChat
        isChatOpen={isChatOpen}
        messages={messages}
        message={message}
        onMessageChange={(newMessage) => setMessage(newMessage)}
        onSendMessage={handleSendMessage}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        goofyMessages={[]}
      />
    </Container>
  );
};

export default Room;
