import { Avatar, AvatarGroup, Box, Typography } from "@mui/material";
import { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";
import User from "../types.defined";

interface RoomBoxProps {
  roomId: string;
  roomName: string;
  roomDescription: string;
  users: User[];
  path: string;
}

const RoomBox: FunctionComponent<RoomBoxProps> = ({
  roomDescription,
  roomId,
  roomName,
  users,
  path,
}) => {
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const user = JSON.parse(userData as string);

  const handleRedirect = async() => {
    // await fetch(`http://localhost:8000/room/${roomId}/${user._id}`, {
    //   method: "GET",
   
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data)
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
        navigate(`/room/${roomId}`)
  }
  
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
      <AvatarGroup
        max={4}
        sx={{
          display: "flex",
          flexDirection: "row",
          mt: 1,
        }}
      >
        {users.map((user) => {
          return <Avatar key={user._id} src={user.photoURL} />;
        })}
      </AvatarGroup>
    </Box>
  );
};

export default RoomBox;
