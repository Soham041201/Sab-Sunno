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
import { useSocketService } from '../services/webrtc/socket.service';
import { usePipecatRTVI } from '../hooks/usePipecatRTVI';

const Room: FunctionComponent = () => {
  const { roomId } = useParams();
  const user = useSelector(selectUser);
  const [room, setRoom] = useState<any>({});
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const { botAudioStream, sendAudioToBot } = usePipecatRTVI(roomId || '');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { sendGeminiMessage, onGeminiResponse, onGeminiTyping, onGeminiError } =
    useSocketService();
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [messages, setMessages] = useState<
    Array<{ text: string; timestamp: Date; role: string }>
  >([]);
  const [goofyMessages, setGoofyMessages] = useState<
    Array<{ text: string; timestamp: Date; role: string }>
  >([]);
  const [isAITyping, setIsAITyping] = useState(false);

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
    handleMute(user._id, isMuted);
  }, [isMuted, user._id, handleMute]);

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

  // Create an audio mixer to combine streams
  useEffect(() => {
    if (!botAudioStream || !botAudioStream.getAudioTracks().length) return;

    let audioContext: AudioContext | null = null;
    try {
      audioContext = new AudioContext();
      const mixedDestination = audioContext.createMediaStreamDestination();

      // Add bot's audio to the mix with error handling
      try {
        const botSource = audioContext.createMediaStreamSource(botAudioStream);
        const botGain = audioContext.createGain();
        botGain.gain.value = 1.0; // Increased bot volume
        botSource.connect(botGain);
        botGain.connect(mixedDestination);

        // Create and play bot audio element
        const botAudio = new Audio();
        botAudio.srcObject = botAudioStream;
        botAudio.autoplay = true;
        botAudio
          .play()
          .catch((err) => console.error('Error playing bot audio:', err));
      } catch (err) {
        console.error('Error adding bot audio:', err);
      }

      // Add each client's audio to the mix
      clients.forEach((client: RoomUser) => {
        try {
          const audioElement = provideRef(
            null,
            client._id
          ) as unknown as HTMLAudioElement;
          if (
            audioElement?.srcObject &&
            (audioElement.srcObject as MediaStream).getAudioTracks().length > 0
          ) {
            const clientSource = audioContext!.createMediaStreamSource(
              audioElement.srcObject as MediaStream
            );
            const clientGain = audioContext!.createGain();
            clientGain.gain.value = 0.5; // Client volume
            clientSource.connect(clientGain);
            clientGain.connect(mixedDestination);
          }
        } catch (err) {
          console.error(`Error adding client ${client._id} audio:`, err);
        }
      });

      // Use the mixed stream
      const mixedAudio = new Audio();
      mixedAudio.srcObject = mixedDestination.stream;
      mixedAudio.autoplay = true;
      mixedAudio
        .play()
        .catch((err) => console.error('Error playing mixed audio:', err));

      return () => {
        try {
          audioContext?.close();
        } catch (err) {
          console.error('Error closing audio context:', err);
        }
      };
    } catch (err) {
      console.error('Error setting up audio mixing:', err);
    }
  }, [botAudioStream, clients]);

  // Send local audio to both WebRTC peers and the bot
  useEffect(() => {
    if (!user._id || isMuted) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        // Send to WebRTC peers
        handleMute(user._id, false);

        // Send to bot
        sendAudioToBot(stream);
      })
      .catch((err) => console.error('Error accessing microphone:', err));
  }, [isMuted, user._id]);

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
