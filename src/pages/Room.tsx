import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import {
  Avatar,
  Badge,
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { FunctionComponent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useWebRTC } from "../hooks/useWebRTC";
import muteIcon from "../images/mute.png";
import { RootState } from "../redux/store";
import { RoomUser } from "../types.defined";

const Room: FunctionComponent = () => {
  const { roomId } = useParams();
  const user = useSelector((state: RootState) => state.user.user);
  const [room, setRoom] = useState<any>({});
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  useEffect(() => {
    handleMute(user._id, isMuted, roomId);
  }, [isMuted]);

  useEffect(() => {
    fetch(`http://localhost:8000/room/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setRoom(data.room);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            my: 1,
          }}
        >
          <Typography variant={"h1"}>{room.roomName}</Typography>
          <Typography variant={"h3"}>{room.roomDescription}</Typography>
        </Box>

        <Box
          component={"div"}
          sx={{
            mx: { sm: 3, md: 5, lg: 10 },
            p: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            display: "flex",
            height: { sx: "80vh", sm: "80vh", md: 360, lg: 345 },
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "0.1em",
              backgroundColor: "white",
              color: "black",
            },
          }}
        >
          <Grid container spacing={1}>
            {clients &&
              clients?.map((client: RoomUser) => {
                return (
                  <Grid item xs={4} sm={4} md={2} key={clients.indexOf(client)}>
                    <Box
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
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              backgroundColor: "transparent",
                            }}
                            src={muteIcon}
                            variant="circular"
                          />
                        }
                        invisible={!client.isMuted}
                      >
                        <Avatar
                          src={client?.photoURL}
                          sx={{ width: 48, height: 48 }}
                        />
                      </Badge>
                      <Typography variant={"body1"} sx={{ my: 1 }}>
                        {client.firstName}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
          </Grid>
        </Box>
        <Box
          sx={{
            bottom: 0,
            position: "center",
            mx: "auto",
            my: 2,
          }}
        >
          <IconButton
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              bottom: 0,
            }}
            onClick={() => setIsMuted(!isMuted)}
          >
            {!isMuted ? (
              <MicIcon
                sx={{
                  fontSize: "32px",
                }}
              />
            ) : (
              <MicOffIcon
                sx={{
                  fontSize: "32px",
                }}
              />
            )}
          </IconButton>
        </Box>
      </Container>
    </div>
  );
};

export default Room;
