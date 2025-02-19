import AddIcon from '@mui/icons-material/Add';
import {
  Container,
  Grid,
  Typography,
  Box,
  useTheme,
  InputAdornment,
} from '@mui/material';
import { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RoomBox from '../components/RoomBox';
import { setNotification } from '../redux/slice/notificationSlice';
import { selectUser } from '../redux/slice/userSlice';
import { uri } from '../config/config';
import NeoPOPButton from '../components/common/NeoPOPButton';
import CreateRoomDialog from '../components/common/CreateRoomDialog';
import NeoPOPTextField from '../components/common/NeoPOPTextField';
import SearchIcon from '@mui/icons-material/Search';

const Home: FunctionComponent = () => {
  const [isNewRoom, setIsNewRoom] = useState(false);

  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');

  const navigate = useNavigate();

  const [rooms, setRooms] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${uri}/rooms`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        setRooms(data.rooms);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleClose = () => {
    setIsNewRoom(false);
  };

  const createNewRoom = async () => {
    if (roomName.length > 0 && roomDescription.length > 0) {
      const roomData = {
        roomName: roomName,
        roomDescription: roomDescription,
        users: [user],
        createdBy: user,
      };
      await fetch(`${uri}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            dispatch(
              setNotification({
                message: 'Room Created Successfully',
                type: 'success',
              })
            );
            navigate(`/room/${data.room._id}`);
          }
        })
        .catch((error) => {
          dispatch(
            setNotification({
              message: 'Oh no! Something went wrong. Please try again',
              type: 'error',
            })
          );
          console.error('Error:', error);
        });
    } else {
      dispatch(
        setNotification({
          message: 'Please fill all the fields',
          type: 'error',
        })
      );
    }
  };

  const theme = useTheme();

  return (
    <Container
      maxWidth='xl'
      sx={{
        minHeight: '100vh',
        py: 4,
        px: { xs: 2, md: 4 },
        backgroundColor: '#fafafa',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 5,
          gap: 3,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -12,
              left: 0,
              width: 80,
              height: 4,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Typography
            variant='h3'
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: 'Raleway',
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '-0.02em',
            }}
          >
            Trending Topics
          </Typography>
        </Box>

        <NeoPOPButton icon={<AddIcon />} onClick={() => setIsNewRoom(true)}>
          Create Room
        </NeoPOPButton>
      </Box>

      <CreateRoomDialog
        open={isNewRoom}
        onClose={handleClose}
        onSubmit={createNewRoom}
        onRoomNameChange={setRoomName}
        onRoomDescriptionChange={setRoomDescription}
      />

      <NeoPOPTextField
        placeholder='Search rooms...'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          width: { xs: '100%', md: '400px' },
          mb: 4,
          mt: 2
        }}
      />

      <Grid container spacing={3}>
        {rooms?.map((room: any) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
            <RoomBox
              roomId={room._id}
              roomName={room.roomName}
              roomDescription={room.roomDescription}
              createdBy={room.createdBy}
              users={room.users}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;
