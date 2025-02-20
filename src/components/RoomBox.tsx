import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { FunctionComponent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../redux/slice/userSlice';
import { User } from '../types.defined';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { setNotification } from '../redux/slice/notificationSlice';
import { uri } from '../config/config';
import NeoPOPButton from './common/NeoPOPButton';

interface RoomBoxProps {
  roomId: string;
  roomName: string;
  roomDescription: string;
  users: User[];
  createdBy: User;
}

const RoomBox: FunctionComponent<RoomBoxProps> = ({
  roomDescription,
  roomId,
  roomName,
  users,
  createdBy,
}) => {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleRedirect = () => {
    navigate(`/room/${roomId}`);
  };

  const handleDelete = async () => {
    await fetch(`${uri}/room/${roomId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          setNotification({
            type: 'success',
            message: 'Room deleted successfully',
          })
        );
        window.location.reload();
      })
      .catch((error) => {
        dispatch(
          setNotification({ type: 'error', message: 'Error deleting room' })
        );
        console.error(error);
      });
  };

  return (
    <Box
      onClick={handleRedirect}
      sx={{
        backgroundColor: '#ffffff',
        p: 3,
        borderRadius: '2px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        position: 'relative',
        transition: 'all 0.2s ease',
        border: '1px solid rgba(0, 0, 0, 0.12)',
        boxShadow: `
          4px 4px 0 rgba(0, 0, 0, 0.2),
          8px 8px 0 rgba(255, 132, 19, 0.2)
        `,
        '&:hover': {
          transform: 'translate(-2px, -2px)',
          boxShadow: `
            6px 6px 0 rgba(0, 0, 0, 0.2),
            10px 10px 0 rgba(255, 132, 19, 0.2)
          `,
        },
        '&:active': {
          transform: 'translate(2px, 2px)',
          boxShadow: `
            2px 2px 0 rgba(0, 0, 0, 0.2),
            4px 4px 0 rgba(255, 132, 19, 0.2)
          `,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 800,
              fontFamily: 'Raleway',
              color: '#000000',
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {roomName}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.95rem',
              color: 'rgba(0, 0, 0, 0.7)',
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            {roomDescription}
          </Typography>
        </Box>

        {user._id === createdBy._id && (
          <Tooltip title='Delete room'>
            <IconButton
              onClick={handleDelete}
              sx={{
                color: theme.palette.error.main,
                p: 1,
                borderRadius: '2px',
                border: '1px solid',
                borderColor: 'rgba(211, 47, 47, 0.3)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  transform: 'translate(-1px, -1px)',
                  boxShadow: '2px 2px 0 rgba(211, 47, 47, 0.2)',
                },
                '&:active': {
                  transform: 'translate(1px, 1px)',
                  boxShadow: 'none',
                },
              }}
            >
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 'auto',
          pt: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box>
          {users.length > 0 ? (
            <AvatarGroup
              max={4}
              sx={{
                '& .MuiAvatar-root': {
                  width: 28,
                  height: 28,
                  fontSize: '0.875rem',
                  border: '2px solid #ffffff',
                  boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.12)',
                  '&:not(:first-of-type)': {
                    marginLeft: -1,
                  },
                },
              }}
            >
              {users.map(
                (user) =>
                  user && (
                    <Avatar
                      key={user._id}
                      src={user?.photoURL}
                      alt={user?.firstName}
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                      }}
                    />
                  )
              )}
            </AvatarGroup>
          ) : (
            <Typography
              sx={{
                fontSize: '0.875rem',
                color: 'rgba(0, 0, 0, 0.5)',
                fontStyle: 'italic',
              }}
            >
              No participants yet
            </Typography>
          )}
        </Box>

        <NeoPOPButton
          icon={<ArrowForwardIcon />}
          iconPosition='end'
          size='small'
        >
          Join Room
        </NeoPOPButton>
      </Box>
    </Box>
  );
};

export default RoomBox;
