import { Avatar, Box, Container, Typography } from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useWebRTC } from "../hooks/useWebRTC";

const Room: FunctionComponent = () => {
  const { roomId } = useParams();
  // const user = useSelector((state: any) => state.user.user);
  let userData = localStorage.getItem("user");
  const user = JSON.parse(userData as string);
  const [room, setRoom] = useState<any>({});
  const { clients, provideRef } = useWebRTC(roomId, user);

  useEffect(() => {
    const getRoom = async () => {
      await fetch(`http://localhost:8000/room/${roomId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) {
            console.log(data);
            setRoom(data.room);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };
    getRoom();
  }, []);

  return (
    <div>
      <Container>
        <Typography variant={"h1"}>{room.roomName}</Typography>
        <Typography variant={"h3"}>{room.roomDescription}</Typography>
        <Box
          sx={{
            m: 10,
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
          }}
        >
          {clients.map((client: any) => {
            return (
              <Box
                key={clients.indexOf(client)}
                sx={{
                  p: 1,
                }}
              >
                <audio
                  autoPlay
                  ref={(instance) => {
                    provideRef(instance, client._id);
                  }}
                />
                <Avatar src={client?.photoURL} sx={{ width: 48, height: 48 }} />
                <Typography variant={"h3"}>{client.firstName}</Typography>
              </Box>
            );
          })}
        </Box>
      </Container>
    </div>
  );
};

export default Room;
