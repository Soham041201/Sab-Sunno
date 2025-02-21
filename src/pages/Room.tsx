import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '../images/mic-icon.svg';
import MicOffIcon from '../images/mic-off-icon.svg';
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
import { FunctionComponent, useEffect, useState, useCallback } from 'react';
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
import { useSocketService } from '../services/webrtc/socket.service';
import { usePipecatRTVI } from '../hooks/usePipecatRTVI';
import { copy } from '../utils/misc';
import { useRoomAudio } from '../hooks/audio/useRoomAudio';

const Room: FunctionComponent = () => {
  const { roomId } = useParams();
  const user = useSelector(selectUser);
  const [room, setRoom] = useState<any>({});
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const { botAudioStream } = usePipecatRTVI(roomId || '');
  const { sendGeminiMessage, onGeminiResponse, onGeminiTyping, onGeminiError } =
    useSocketService();
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<
    Array<{ text: string; timestamp: Date; role: string }>
  >([]);
  const [goofyMessages, setGoofyMessages] = useState<
    Array<{ text: string; timestamp: Date; role: string }>
  >([]);
  const [isAITyping, setIsAITyping] = useState(false);
  const [isBotAudioActive, setIsBotAudioActive] = useState(false);

  // Initialize room audio
  const { state: audioState, controls: audioControls } = useRoomAudio({
    roomId,
    user,
    clients,
    botAudioStream,
    provideRef,
    onError: (error) => {
      dispatch(
        setNotification({
          type: 'error',
          message: `Audio Error: ${error.message}`,
        })
      );
    },
  });

  // Handle mute state changes
  useEffect(() => {
    audioControls.setMuted(isMuted);
    handleMute(user._id, isMuted);
  }, [isMuted, user._id, audioControls, handleMute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioControls.cleanup().catch(console.error);
    };
  }, [audioControls]);

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
    const cleanupResponse = onGeminiResponse((response) => {
      setGoofyMessages((prev) => [
        ...prev,
        {
          text: response.message,
          timestamp: new Date(response.timestamp),
          role: 'assistant',
        },
      ]);
      setIsAITyping(false);
    });

    const cleanupTyping = onGeminiTyping(({ isTyping }) => {
      setIsAITyping(isTyping);
    });

    const cleanupError = onGeminiError(({ error }) => {
      dispatch(
        setNotification({
          type: 'error',
          message: error,
        })
      );
    });

    return () => {
      cleanupResponse();
      cleanupTyping();
      cleanupError();
    };
  }, [onGeminiResponse, onGeminiTyping, onGeminiError, dispatch]);

  useEffect(() => {
    if (botAudioStream) {
      setIsBotAudioActive(true);

      console.log('Bot Audio Tracks:', botAudioStream.getAudioTracks());

      const track = botAudioStream.getAudioTracks()[0];
      if (track) {
        track.onended = () => {
          console.log('Bot audio track ended');
          setIsBotAudioActive(false);
        };
        track.onmute = () => {
          console.log('Bot audio track muted');
        };
        track.onunmute = () => {
          console.log('Bot audio track unmuted');
        };
      }
    } else {
      setIsBotAudioActive(false);
    }
  }, [botAudioStream]);

  const handleSendMessage = (isGoofy = false) => {
    if (message.trim()) {
      if (isGoofy) {
        setGoofyMessages([
          ...goofyMessages,
          { text: message, timestamp: new Date(), role: 'user' },
        ]);
        setIsAITyping(true);
        sendGeminiMessage({
          message: message,
          chatId: roomId || '',
        });
      } else {
        setMessages([
          ...messages,
          { text: message, timestamp: new Date(), role: 'user' },
        ]);
      }
      setMessage('');
    }
  };

  const handleMuteToggle = useCallback(() => {
    setIsMuted(!isMuted);
  }, [isMuted]);

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

          <NeoPOPButton
            icon={<ShareIcon />}
            onClick={() => copy(dispatch)}
            size='small'
          >
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
                      ref={(instance) => provideRef(instance, client._id)}
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
              onClick={handleMuteToggle}
              disabled={audioState.error !== null}
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
                },
              }}
            >
              <Box
                component='img'
                src={!isMuted ? MicIcon : MicOffIcon}
                sx={{
                  width: 28,
                  height: 28,
                  filter: 'brightness(0) invert(1)',
                  transition: 'transform 0.2s ease',
                  transform: isMuted ? 'rotate(-6deg)' : 'none',
                }}
              />
            </IconButton>
          </Box>

          {audioState.error && (
            <Typography
              sx={{
                color: theme.palette.error.main,
                mt: 2,
                fontSize: '0.875rem',
              }}
            >
              Audio Error: {audioState.error.message}
            </Typography>
          )}

          {isBotAudioActive && (
            <Typography
              sx={{
                color: theme.palette.success.main,
                mt: 1,
                fontSize: '0.875rem',
              }}
            >
              Bot Audio Connected
            </Typography>
          )}
        </Container>
      </Box>

      <RoomChat
        isChatOpen={isChatOpen}
        messages={messages}
        message={message}
        onMessageChange={(newMessage) => setMessage(newMessage)}
        onSendMessage={handleSendMessage}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        goofyMessages={goofyMessages}
        roomId={roomId || ''}
        isAITyping={isAITyping}
      />
    </Container>
  );
};

export default Room;
