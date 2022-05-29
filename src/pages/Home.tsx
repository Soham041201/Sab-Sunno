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
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import RoomBox from "../components/RoomBox";

const Home: FunctionComponent = () => {
  const uuid = uuidv4();
  const roomId = uuid as unknown as string;
  const [isNewRoom, setIsNewRoom] = useState(false);

  let user = localStorage.getItem("user")
  if(user){
    user = JSON.parse(user.trim());
  }
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const navigate = useNavigate();

  const [Rooms, setRooms] = useState<any>([]);

  useEffect(() => {
    fetch("http://localhost:8000/getRooms", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data.rooms);
            setRooms(data.rooms)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  },[])
  

  const handleClose = () => {
    setIsNewRoom(false);
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
              onClick={async () => {
                const roomData = {
                  id: roomId,
                  roomName: roomName,
                  roomDescription: roomDescription,
                  users: [user],
                  createdBy: user,
                };
                await fetch("http://localhost:8000/createRoom", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(roomData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    if (data) {
                      navigate(`/room/${roomId}`);
                    }
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              }}
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

      {Rooms?.map((room : any) => {
        return (
          <RoomBox
            key={Rooms.indexOf(room)}
            roomId={roomId}
            roomName={room.roomName}
            roomDescription={room.roomDescription}
            users={room.users}
            onClick={(roomId) => navigate(`/room/${roomId}`)}
          />
        );
      })}
    </Container>
  );
};

export default Home;
