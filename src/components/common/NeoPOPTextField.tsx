import { TextField, TextFieldProps, useTheme } from '@mui/material';
import { FunctionComponent } from 'react';

interface NeoPOPTextFieldProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'primary' | 'secondary';
}

const NeoPOPTextField: FunctionComponent<NeoPOPTextFieldProps> = ({
  variant = 'primary',
  sx,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TextField
      variant='outlined'
      sx={{
        width: '100%',
        '& .MuiOutlinedInput-root': {
          borderRadius: 0,
          transition: 'all 0.2s ease',
          backgroundColor: '#ffffff',
          borderColor: 'rgba(0, 0, 0, 0.12)',
          '&.Mui-focused': {
            transform: 'translate(-4px, -4px)',
            boxShadow: '4px 4px 0 rgba(0, 0, 0, 0.2)',
            borderColor: theme.palette.primary.main,
          },
          '&:hover': {
            borderColor: 'rgba(0, 0, 0, 0.24)',
          },
          '&.Mui-disabled': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            borderColor: 'rgba(0, 0, 0, 0.08)',
          },
        },
        '& .MuiInputLabel-root': {
          fontFamily: 'Raleway',
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

export default NeoPOPTextField;
