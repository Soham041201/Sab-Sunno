import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import User from "../types.defined";

interface RoomBoxProps {
  roomId: string;
  roomName: string;
  roomDescription: string;
  users: User[];
  onClick: (roomId: string) => void;
}

const RoomBox: FunctionComponent<RoomBoxProps> = ({
  roomDescription,
  roomId,
  roomName,
  users,
  onClick,
}) => {
  return (
    <Box
      sx={{
        m: 2,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        p: 2,
        borderRadius: "20px",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
      }}
      onClick={() => onClick(roomId)}
    >
      <Typography variant={"h2"}>{roomName}</Typography>
      <Typography variant={"h3"}>{roomDescription}</Typography>
      <AvatarGroup max={4} sx={{
        display: "flex",
        flexDirection: "row",
        mt:1
      }}>
        {users.map((user) => {
          return <Avatar key={user._id} src={user.photoURL} />;
        })}
      </AvatarGroup>
    </Box>
  );
};

export default RoomBox;
