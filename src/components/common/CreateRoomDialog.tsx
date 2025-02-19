import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
  Box,
} from '@mui/material';
import { FunctionComponent } from 'react';
import NeoPOPButton from './NeoPOPButton';
import NeoPOPTextField from './NeoPOPTextField';

interface CreateRoomDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onRoomNameChange: (value: string) => void;
  onRoomDescriptionChange: (value: string) => void;
}

const CreateRoomDialog: FunctionComponent<CreateRoomDialogProps> = ({
  open,
  onClose,
  onSubmit,
  onRoomNameChange,
  onRoomDescriptionChange,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        elevation: 0,
        sx: {
          borderRadius: '4px',
          boxShadow: `
            4px 4px 0 rgba(0, 0, 0, 0.1),
            8px 8px 20px rgba(255, 132, 19, 0.15)
          `,
          border: '1px solid rgba(0, 0, 0, 0.08)',
          backgroundColor: '#ffffff',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          pb: 2.5,
          background: 'linear-gradient(60deg, #fff 30%, #FFF5E9 90%)',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Typography
            variant='h4'
            sx={{
              color: '#1A1A1A',
              fontFamily: 'Raleway',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              position: 'relative',
              zIndex: 1,
              mb: 1,
            }}
          >
            Create Your Space
          </Typography>
          <Box
            sx={{
              position: 'absolute',
              bottom: 6,
              left: -2,
              width: '105%',
              height: '12px',
              backgroundColor: 'rgba(255, 132, 19, 0.15)',
              zIndex: 0,
              transform: 'rotate(-1deg)',
            }}
          />
        </Box>
        <Typography
          sx={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontFamily: 'Raleway',
            fontSize: '0.95rem',
            fontWeight: 500,
          }}
        >
          Design a unique room for meaningful conversations
        </Typography>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          background: 'linear-gradient(180deg, #fff 0%, #FEFEFE 100%)',
        }}
      >
        <DialogContentText>
          <Typography
            sx={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontFamily: 'Raleway',
              mb: 3,
              fontSize: '0.95rem',
              lineHeight: 1.6,
              position: 'relative',
              pl: 2,
              borderLeft: `3px solid ${theme.palette.primary.main}`,
              fontStyle: 'italic',
            }}
          >
            Create a welcoming space where people can connect, share ideas, and
            have engaging discussions.
          </Typography>
        </DialogContentText>

        <NeoPOPTextField
          autoFocus
          margin='dense'
          label='Room Name'
          placeholder='Give your room a catchy name...'
          fullWidth
          onChange={(e) => onRoomNameChange(e.target.value)}
        />
        <NeoPOPTextField
          margin='dense'
          label='Room Description'
          placeholder='Share what makes your room special and what kind of discussions to expect...'
          fullWidth
          multiline
          rows={3}
          onChange={(e) => onRoomDescriptionChange(e.target.value)}
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          gap: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          background: 'linear-gradient(180deg, #FEFEFE 0%, #F8F8F8 100%)',
        }}
      >
        <NeoPOPButton variant='secondary' onClick={onClose} size='medium'>
          Cancel
        </NeoPOPButton>
        <NeoPOPButton onClick={onSubmit}>Launch Room</NeoPOPButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRoomDialog;
