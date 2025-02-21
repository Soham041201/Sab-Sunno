import {
  Box,
  IconButton,
  InputAdornment,
  Typography,
  useTheme,
  Tabs,
  Tab,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import GroupIcon from '@mui/icons-material/Group';
import {
  FunctionComponent,
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import NeoPOPTextField from './common/NeoPOPTextField';

interface RoomChatProps {
  isChatOpen: boolean;
  messages: Array<{
    role: string;
    text: string;
    timestamp: Date;
  }>;
  goofyMessages: Array<{
    text: string;
    timestamp: Date;
    isBot?: boolean;
    role: string;
  }>;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (isGoofy?: boolean) => void;
  onToggleChat: () => void;
  roomId: string;
  isAITyping: boolean;
}

const RoomChat: FunctionComponent<RoomChatProps> = ({
  isChatOpen,
  messages,
  goofyMessages,
  message,
  onMessageChange,
  onSendMessage,
  onToggleChat,
  roomId,
  isAITyping,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll when messages change or when AI is typing
  useEffect(() => {
    scrollToBottom();
  }, [messages, goofyMessages, isAITyping, scrollToBottom]);

  const ChatMessage = ({
    text,
    timestamp,
    isBot,
    role,
    isAITyping,
  }: {
    text: string;
    timestamp: Date;
    isBot?: boolean;
    role: string;
    isAITyping: boolean;
  }) => (
    <Box
      sx={{
        backgroundColor:
          role === 'assistant' ? 'rgba(240, 247, 255, 0.8)' : '#ffffff',
        p: 1.5,
        borderRadius:
          role === 'assistant' ? '2px 10px 10px 10px' : '10px 2px 10px 10px',
        boxShadow:
          role === 'assistant'
            ? '0 1px 4px rgba(0,0,0,0.06)'
            : '0 1px 3px rgba(0,0,0,0.04)',
        maxWidth: '75%',
        alignSelf: role === 'assistant' ? 'flex-start' : 'flex-end',
        marginLeft: role === 'assistant' ? '8px' : 'auto',
        marginRight: role === 'assistant' ? 'auto' : '8px',
        marginBottom: '2px', // Reduced from 4px to 2px
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow:
            role === 'assistant'
              ? '0 2px 8px rgba(0,0,0,0.08)'
              : '0 2px 6px rgba(0,0,0,0.06)',
        },
        transition: 'all 0.2s ease',
        border: `1px solid ${
          role === 'assistant'
            ? 'rgba(66, 133, 244, 0.15)'
            : 'rgba(0, 0, 0, 0.06)'
        }`,
        '&::before':
          role === 'assistant'
            ? {
                content: '""',
                position: 'absolute',
                left: -16,
                top: 0,
                width: 16,
                height: 16,
                backgroundImage: 'url(/bot-avatar.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
              }
            : {},
      }}
    >
      <Typography
        sx={{
          fontSize: '0.85rem',
          color:
            role === 'assistant'
              ? 'rgba(0, 0, 0, 0.85)'
              : 'rgba(0, 0, 0, 0.75)',
          fontFamily: 'Raleway',
          lineHeight: 1.4,
          mb: 0.1, // Reduced from 0.25 to 0.1
          fontWeight: role === 'assistant' ? 500 : 400,
        }}
      >
        {text}
        {role === 'assistant' && isAITyping && (
          <Box
            component='span'
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              ml: 0.5,
            }}
          >
            <Box
              component='span'
              sx={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: 'rgba(66, 133, 244, 0.5)',
                animation: 'typing 0.8s infinite',
                '&:nth-of-type(2)': {
                  animationDelay: '0.2s',
                  mx: 0.3,
                },
                '&:nth-of-type(3)': {
                  animationDelay: '0.4s',
                },
                '@keyframes typing': {
                  '0%, 100%': {
                    transform: 'translateY(0)',
                  },
                  '50%': {
                    transform: 'translateY(-3px)',
                  },
                },
              }}
            />
            <Box
              component='span'
              sx={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: 'rgba(66, 133, 244, 0.5)',
                animation: 'typing 0.8s infinite',
                mx: 0.3,
                animationDelay: '0.2s',
              }}
            />
            <Box
              component='span'
              sx={{
                width: 3,
                height: 3,
                borderRadius: '50%',
                backgroundColor: 'rgba(66, 133, 244, 0.5)',
                animation: 'typing 0.8s infinite',
                animationDelay: '0.4s',
              }}
            />
          </Box>
        )}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.65rem',
          color:
            role === 'assistant'
              ? 'rgba(66, 133, 244, 0.5)'
              : 'rgba(0, 0, 0, 0.35)',
          fontFamily: 'Raleway',
          textAlign: 'right',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '3px',
        }}
      >
        {role === 'assistant' && <SmartToyIcon sx={{ fontSize: 10 }} />}
        {timestamp.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        width: isChatOpen ? 360 : 48,
        height: '70vh',
        position: 'fixed',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: '#ffffff',
        borderRadius: '16px 0 0 16px',
        boxShadow: isChatOpen ? '-8px 0 32px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        maxHeight: 'calc(100vh - 160px)',
        margin: '80px 0',
        overflow: 'hidden',
      }}
    >
      {/* Toggle Button */}
      <Box
        onClick={onToggleChat}
        sx={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 48,
          height: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 132, 19, 0.04)',
          },
        }}
      >
        {isChatOpen ? (
          <ChevronRightIcon
            sx={{
              color: theme.palette.primary.main,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
              },
            }}
          />
        ) : (
          <Typography
            sx={{
              transform: 'rotate(-90deg)',
              color: theme.palette.primary.main,
              fontFamily: 'Raleway',
              fontWeight: 600,
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
            }}
          >
            Chat
          </Typography>
        )}
      </Box>

      {isChatOpen && (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant='fullWidth'
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
            >
              <Tab
                icon={<GroupIcon />}
                label='Room'
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  minHeight: 56,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
              <Tab
                icon={<SmartToyIcon />}
                label='Goofy AI'
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Raleway',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  minHeight: 56,
                  '&.Mui-selected': {
                    color: theme.palette.primary.main,
                  },
                }}
              />
            </Tabs>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: 3,
              },
            }}
          >
            {(activeTab === 0 ? messages : goofyMessages).map((msg, index) => (
              <ChatMessage
                key={index}
                text={msg.text}
                timestamp={msg.timestamp}
                isBot={activeTab === 1}
                role={msg.role}
                isAITyping={isAITyping}
              />
            ))}
            <div ref={messagesEndRef} />
          </Box>

          <Box
            sx={{
              p: 2,
              backgroundColor: '#ffffff',
              borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <NeoPOPTextField
              fullWidth
              placeholder={
                activeTab === 0 ? 'Type your message...' : 'Ask Goofy...'
              }
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && onSendMessage(activeTab === 1)
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => onSendMessage(activeTab === 1)}
                      sx={{
                        color: theme.palette.primary.main,
                        '&:hover': {
                          backgroundColor: 'rgba(255, 132, 19, 0.08)',
                        },
                      }}
                    >
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default RoomChat;
