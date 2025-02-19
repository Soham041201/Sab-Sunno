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
import { FunctionComponent, useState } from 'react';
import NeoPOPTextField from './common/NeoPOPTextField';

interface RoomChatProps {
  isChatOpen: boolean;
  messages: Array<{ text: string; timestamp: Date }>;
  goofyMessages: Array<{ text: string; timestamp: Date; isBot?: boolean }>;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (isGoofy?: boolean) => void;
  onToggleChat: () => void;
}

const RoomChat: FunctionComponent<RoomChatProps> = ({
  isChatOpen,
  messages,
  goofyMessages,
  message,
  onMessageChange,
  onSendMessage,
  onToggleChat,
}) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const ChatMessage = ({
    text,
    timestamp,
    isBot,
  }: {
    text: string;
    timestamp: Date;
    isBot?: boolean;
  }) => (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        p: 2,
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        maxWidth: '85%',
        alignSelf: isBot ? 'flex-start' : 'flex-end',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        },
        transition: 'all 0.2s ease',
        border: `1px solid ${
          isBot ? 'rgba(44, 62, 80, 0.1)' : theme.palette.primary.light
        }`,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.9rem',
          color: 'rgba(0, 0, 0, 0.8)',
          fontFamily: 'Raleway',
          lineHeight: 1.5,
          mb: 1,
        }}
      >
        {text}
      </Typography>
      <Typography
        sx={{
          fontSize: '0.7rem',
          color: 'rgba(0, 0, 0, 0.4)',
          fontFamily: 'Raleway',
          textAlign: 'right',
        }}
      >
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
              />
            ))}
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
