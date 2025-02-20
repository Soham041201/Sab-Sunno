import { Box, Button, Typography, useTheme } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { FunctionComponent, useState } from 'react';
import CustomLoader from '../components/Loader';

const GetStarted: FunctionComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  const handleNavigation = async () => {
    setIsLoading(true);
    try {
      await navigate('/login');
    } catch (error) {
      console.error('Navigation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <CustomLoader />;

  return (
    <Box
      component='main'
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 'sm',
          p: 3,
        }}
      >
        <Title />
        <Button
          variant='contained'
          disableElevation
          onClick={handleNavigation}
          sx={{
            backgroundColor: 'white',
            my: 4,
            width: 200,
            borderRadius: '60px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(248, 248, 248, 0.8)',
              transform: 'scale(1.05)',
            },
          }}
        >
          <Typography
            sx={{
              color: 'black',
              textTransform: 'none',
              fontFamily: 'Raleway',
              fontWeight: 'bold',
            }}
          >
            Get Started
          </Typography>
          <NavigateNextIcon
            sx={{
              color: 'black',
              ml: 1,
            }}
          />
        </Button>
      </Box>
    </Box>
  );
};

export default GetStarted;
