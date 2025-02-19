import { Button, ButtonProps, Typography, useTheme } from '@mui/material';
import { FunctionComponent, ReactNode } from 'react';

interface NeoPOPButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'start' | 'end';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const NeoPOPButton: FunctionComponent<NeoPOPButtonProps> = ({
  variant = 'primary',
  children,
  icon,
  iconPosition = 'start',
  size = 'medium',
  disabled = false,
  sx,
  ...props
}) => {
  const theme = useTheme();

  const baseStyles = {
    textTransform: 'none',
    borderRadius: '2px',
    position: 'relative',
    border: '1px solid rgba(0, 0, 0, 0.12)',
    transition: 'all 0.2s ease',
    fontFamily: 'Raleway',
    fontWeight: 600,
    minWidth: 'auto',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  const sizeStyles = {
    small: {
      px: 2,
      py: 0.75,
      fontSize: '0.875rem',
      '& .MuiButton-startIcon': {
        marginRight: 1,
      },
      '& .MuiButton-endIcon': {
        marginLeft: 1,
      },
    },
    medium: {
      px: 3,
      py: 1.5,
      fontSize: '0.95rem',
      '& .MuiButton-startIcon': {
        marginRight: 1.5,
      },
      '& .MuiButton-endIcon': {
        marginLeft: 1.5,
      },
    },
    large: {
      px: 4,
      py: 2,
      fontSize: '1rem',
      '& .MuiButton-startIcon': {
        marginRight: 2,
      },
      '& .MuiButton-endIcon': {
        marginLeft: 2,
      },
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: theme.palette.primary.main,
      color: '#ffffff',
      boxShadow: disabled
        ? 'none'
        : `
        2px 2px 0 rgba(0, 0, 0, 0.2),
        4px 4px 0 rgba(255, 132, 19, 0.3)
      `,
      '&:hover': !disabled && {
        backgroundColor: '#FF7F50',
        transform: 'translate(-2px, -2px)',
        boxShadow: `
          4px 4px 0 rgba(0, 0, 0, 0.2),
          6px 6px 0 rgba(255, 127, 80, 0.3)
        `,
      },
      '&:active': !disabled && {
        transform: 'translate(2px, 2px)',
        boxShadow: `
          1px 1px 0 rgba(0, 0, 0, 0.2),
          2px 2px 0 rgba(255, 132, 19, 0.3)
        `,
      },
    },
    secondary: {
      backgroundColor: '#ffffff',
      color: 'rgba(0, 0, 0, 0.85)',
      boxShadow: disabled ? 'none' : '2px 2px 0 rgba(0, 0, 0, 0.1)',
      '&:hover': !disabled && {
        backgroundColor: '#ffffff',
        transform: 'translate(-1px, -1px)',
        boxShadow: '3px 3px 0 rgba(0, 0, 0, 0.1)',
      },
      '&:active': !disabled && {
        transform: 'translate(1px, 1px)',
        boxShadow: 'none',
      },
    },
    danger: {
      backgroundColor: theme.palette.error.main,
      color: '#ffffff',
      boxShadow: disabled
        ? 'none'
        : `
        2px 2px 0 rgba(0, 0, 0, 0.2),
        4px 4px 0 rgba(211, 47, 47, 0.3)
      `,
      '&:hover': !disabled && {
        backgroundColor: theme.palette.error.dark,
        transform: 'translate(-2px, -2px)',
        boxShadow: `
          4px 4px 0 rgba(0, 0, 0, 0.2),
          6px 6px 0 rgba(211, 47, 47, 0.3)
        `,
      },
      '&:active': !disabled && {
        transform: 'translate(2px, 2px)',
        boxShadow: `
          1px 1px 0 rgba(0, 0, 0, 0.2),
          2px 2px 0 rgba(211, 47, 47, 0.3)
        `,
      },
    },
  };

  return (
    <Button
      variant='contained'
      startIcon={iconPosition === 'start' ? icon : undefined}
      endIcon={iconPosition === 'end' ? icon : undefined}
      disabled={disabled}
      disableRipple
      sx={[
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...props}
    >
      <Typography
        component='span'
        sx={{
          fontSize: 'inherit',
          fontWeight: 'inherit',
          color: 'inherit',
          textShadow:
            variant !== 'secondary' && !disabled
              ? '1px 1px 0px rgba(0, 0, 0, 0.1)'
              : 'none',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </Typography>
    </Button>
  );
};

export default NeoPOPButton;
