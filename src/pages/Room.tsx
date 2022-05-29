import { Avatar, Box, Container, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { useWebRTC } from "../hooks/useWebRTC";

const Room: FunctionComponent = () => {
  const { roomId } = useParams();

  const userRaw = localStorage.getItem("user");
  const user = JSON.parse(userRaw || "{}");

  const { clients, provideRef } = useWebRTC(roomId, user);

  return (
    <div>
      <Container>
        {clients.map((client: any) => {
          return (
            <Box key={client._id}>
              <audio
                autoPlay
                ref={(instance) => {
                  provideRef(instance, client._id);
                }}
              />
              <Avatar />
              <Typography>{client.firstName}</Typography>
            </Box>
          );
        })}
      </Container>
    </div>
  );
};

export default Room;
