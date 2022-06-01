import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoomBox from "../components/RoomBox";
import { setNotification } from "../redux/slice/notificationSlice";

const Home: FunctionComponent = () => {
  const [isNewRoom, setIsNewRoom] = useState(false);

  // const user = useSelector((state: any) => state.user.user);
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData as string);
  const dispatch = useDispatch();
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<any>([]);
  useEffect(() => {
    fetch("http://localhost:8000/rooms", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.rooms);
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
    const roomData = {
      roomName: roomName,
      roomDescription: roomDescription,
      users: [user],
      createdBy: user,
    };
    await fetch("http://localhost:8000/room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          dispatch(
            setNotification({
              message: "Room Created Successfully",
              type: "success",
            })
          );
          navigate(`/room/${data.room._id}`);
        }
      })
      .catch((error) => {
        dispatch(
          setNotification({
            message: "Oh no! Something went wrong. Please try again",
            type: "error",
          })
        );
        console.error("Error:", error);
      });
  };

  return (
    <Container>
      <Typography
        variant={"h1"}
        sx={{
          width: "10%",
        }}
      >
        Trending Topics
      </Typography>
      <Button
        variant="contained"
        disableElevation
        sx={{
          backgroundColor: "white",
          my: 2,
          mx: "auto",
          width: 200,
          borderRadius: "60px",
          "&:hover": {
            backgroundColor: "rgba(248, 248, 248, 0.8)",
          },
        }}
        onClick={() => setIsNewRoom(true)}
      >
        <Typography
          sx={{
            color: "black",
            textTransform: "none",
            fontFamily: "Raleway",
          }}
        >
          Create a Room
        </Typography>
        <NavigateNextIcon
          sx={{
            color: "black",
          }}
        />
      </Button>

      <div>
        <Dialog
          open={isNewRoom}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            <Typography variant={"h2"} sx={{ color: "#FF8413" }}>
              Create a new Room
            </Typography>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <Typography variant={"h3"} color={"gray"}>
                Startup a conversation in the community by adding your favorite
                topics.
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              variant="outlined"
              size={"small"}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                my: 1,
                width: "50%",
              }}
              label={
                <Typography
                  sx={{
                    fontFamily: "Raleway",
                    color: "black",
                  }}
                >
                  Room Name
                </Typography>
              }
              onChange={(e) => setRoomName(e.target.value)}
            />
            <TextField
              variant="outlined"
              size={"small"}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                my: 1,
                width: "50%",
              }}
              label={
                <Typography
                  sx={{
                    fontFamily: "Raleway",
                    color: "black",
                  }}
                >
                  Room Description
                </Typography>
              }
              onChange={(e) => setRoomDescription(e.target.value)}
            />
            <Button
              variant="contained"
              disableElevation
              sx={{
                backgroundColor: "#FF8413",
                my: 2,
                mx: "auto",
                width: 200,
                borderRadius: "60px",
                "&:hover": {
                  backgroundColor: "rgba(248, 248, 248, 0.8)",
                },
              }}
              onClick={createNewRoom}
            >
              <Typography
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontFamily: "Raleway",
                }}
              >
                Create
              </Typography>
              <NavigateNextIcon
                sx={{
                  color: "white",
                }}
              />
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {rooms &&
        rooms?.map((room: any) => {
          return (
            <RoomBox
              key={rooms.indexOf(room)}
              roomId={room._id}
              roomName={room.roomName}
              roomDescription={room.roomDescription}
              users={room.users}
              path={room._id}
            />
          );
        })}
    </Container>
  );
};

export default Home;
