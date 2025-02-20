import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const Title = () => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const phrases = [
      'Where Every Voice Matters',
      'Connect. Share. Grow.',
      'Conversations That Count',
      'Listen. Learn. Lead.',
    ];
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setDisplayText(
        isDeleting
          ? fullText.substring(0, displayText.length - 1)
          : fullText.substring(0, displayText.length + 1)
      );

      setTypingSpeed(isDeleting ? 100 : 150);

      if (!isDeleting && displayText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, typingSpeed]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '2.5rem 0',
      }}
    >
      <Typography
        variant={'h1'}
        sx={{
          fontSize: ['2.5rem', '3.5rem', '4.5rem'],
          textAlign: 'center',
          fontFamily: 'Raleway',
          fontWeight: 800,
          letterSpacing: '0.15em',
          color: '#2C3E50',
          marginBottom: '1rem',
          textTransform: 'uppercase',
          position: 'relative',
          opacity: 0,
          animation:
            'fadeIn 0.8s ease-out forwards, slideIn 1.2s ease-out forwards',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            width: 0,
            height: '3px',
            backgroundColor: '#2C3E50',
            transform: 'translateX(-50%)',
            animation: 'expandLine 0.8s ease-out 1s forwards',
          },
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
          '@keyframes slideIn': {
            '0%': { transform: 'translateY(30px)' },
            '100%': { transform: 'translateY(0)' },
          },
          '@keyframes expandLine': {
            '0%': { width: '0%' },
            '100%': { width: '40%' },
          },
          '&:hover': {
            transform: 'scale(1.02)',
            transition: 'transform 0.3s ease',
          },
        }}
      >
        Sab Sunno.
      </Typography>

      <Typography
        className='word'
        sx={{
          fontSize: ['1rem', '1.25rem', '1.5rem'],
          textAlign: 'center',
          fontFamily: 'Raleway',
          fontWeight: 500,
          color: 'rgba(44, 62, 80, 0.85)',
          marginTop: '1rem',
          position: 'relative',
          '& span': {
            display: 'inline-block',
            position: 'relative',
            '&::after': {
              content: '""',
              width: '2px',
              height: '1em',
              backgroundColor: (theme) => theme.palette.primary.main,
              position: 'absolute',
              right: '-4px',
              top: '50%',
              transform: 'translateY(-50%)',
              animation: 'blink 0.7s infinite',
            },
          },
          '@keyframes blink': {
            '0%': { opacity: 0 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0 },
          },
        }}
      >
        <span>{displayText}</span>
      </Typography>
    </Box>
  );
};

export default Title;
