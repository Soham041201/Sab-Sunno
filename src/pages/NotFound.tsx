import { Box, Button, Container, Typography, useTheme } from '@mui/material';
import { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const NotFound: FunctionComponent = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          p: 3,
        }}
      >
        <Typography
          variant='h1'
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            textAlign: 'center',
            animation: 'bounce 1s infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        >
          404
        </Typography>
        <Typography
          variant='h2'
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            textAlign: 'center',
            mb: 4,
          }}
        >
          Oops! This page does not exist
        </Typography>
        <Button
          variant='contained'
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            borderRadius: '30px',
            px: 4,
            py: 1.5,
          }}
        >
          Go Home
        </Button>
      </Container>
    </Box>
  );
};

export default NotFound;
