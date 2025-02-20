import { Box, CircularProgress, useTheme } from '@mui/material';
import { FunctionComponent } from 'react';

interface LoaderProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
}

const CustomLoader: FunctionComponent<LoaderProps> = ({
  size = 40,
  color,
  fullScreen = false,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: fullScreen ? 'fixed' : 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: fullScreen
          ? 'rgba(255, 255, 255, 0.8)'
          : 'transparent',
        zIndex: theme.zIndex.modal,
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color: color || theme.palette.primary.main,
        }}
        disableShrink
      />
    </Box>
  );
};

export default CustomLoader;
