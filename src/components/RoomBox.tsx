import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../types.defined";
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
  // const [isCreator, setIsCreator] = useState(false);
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
      <Box
        display="flex"
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant={"h2"}>{roomName}</Typography>
          <Typography variant={"h3"}>{roomDescription}</Typography>
        </Box>
        <Box display="flex">
          <Avatar src={createdBy.photoURL} />
        </Box>
      </Box>
      
      {users.length > 0 ? (
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
            return null;
          })}
        </AvatarGroup>
      ) : (
        <Typography
          sx={{
            mt: 2,
            textAlign: "center",
            color: "#b388ff",
          }}
          variant={"body1"}
        >
          Be the first one to join this room!
        </Typography>
      )}
    </Box>
  );
};

export default RoomBox;
