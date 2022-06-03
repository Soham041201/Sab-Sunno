import { Avatar, AvatarGroup, Badge, Box, Typography } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import User from "../types.defined";
interface RoomBoxProps {
  roomId: string;
  roomName: string;
  roomDescription: string;
  users: User[];
}

const RoomBox: FunctionComponent<RoomBoxProps> = ({
  roomDescription,
  roomId,
  roomName,
  users,
}) => {
  const navigate = useNavigate();

  const handleRedirect = async () => {
    navigate(`/room/${roomId}`);
  };

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
      onClick={handleRedirect}
    >
      <Typography variant={"h2"}>{roomName}</Typography>
      <Typography variant={"h3"}>{roomDescription}</Typography>
      {users && (
        <AvatarGroup
          max={4}
          sx={{
            display: "flex",
            flexDirection: "row",
            mt: 1,
          }}
        >
          {users.map((user) => {
            if (user !== null) {
              return (
                <Avatar key={user._id} src={user?.photoURL && user?.photoURL} />
              );
            }
          })}
        </AvatarGroup>
      )}
    </Box>
  );
};

export default RoomBox;
