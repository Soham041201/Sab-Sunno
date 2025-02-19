import { AppBar, Box, Button, Typography, useTheme } from '@mui/material';
import { FunctionComponent } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../redux/slice/userSlice';
import MenuTab from './MenuTab';

const Menubar: FunctionComponent = () => {
  const user = useSelector(selectUser);
  const theme = useTheme();
  const isMobile = window.innerWidth < 600;
  const navigate = useNavigate();

  return (
    <AppBar
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(8px)',
        boxShadow: `
          0 2px 4px rgba(0, 0, 0, 0.02),
          0 4px 8px rgba(255, 132, 19, 0.08)
        `,
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'row',
        p: { xs: 1.5, md: 2 },
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      position='sticky'
    >
      <Button
        onClick={() => navigate('/home')}
        sx={{
          textTransform: 'none',
          p: 1,
          borderRadius: '4px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'transparent',
            transform: 'translateY(-1px)',
          },
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontSize: { xs: '1.75rem', md: '2rem' },
            fontFamily: 'Raleway',
            fontWeight: 800,
            color: '#2C3E50',
            letterSpacing: '0.02em',
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -4,
              left: 0,
              width: '40%',
              height: '3px',
              backgroundColor: theme.palette.primary.main,
              borderRadius: '2px',
              transition: 'width 0.3s ease',
            },
            '&:hover::after': {
              width: '100%',
            },
          }}
        >
          {isMobile ? 'Ss.' : 'Sab Sunno.'}
        </Typography>
      </Button>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {user._id && <MenuTab user={user} />}
      </Box>
    </AppBar>
  );
};

export default Menubar;
