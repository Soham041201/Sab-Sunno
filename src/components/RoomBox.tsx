import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../redux/slice/userSlice";
import { User } from "../types.defined";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { setNotification } from "../redux/slice/notificationSlice";
import { uri } from "../config/config";

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
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const handleRedirect = async () => {
    navigate(`/room/${roomId}`);
  };

  const handleDelete = async () => {
    await fetch(`${uri}/room/${roomId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch(
          setNotification({
            type: "success",
            message: "Room deleted successfully",
          })
        );
        window.location.reload();
      })
      .catch((error) => {
        dispatch(
          setNotification({ type: "error", message: "Error deleting room" })
        );
        console.error(error);
      });
  };

  return (
    <Box
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        p: 2,
        width: "300px",
        borderRadius: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
      }}
    >
      <Box
        display={"flex"}
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant={"text"}
          onClick={handleRedirect}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
              transform: "scale(1.1)",
              transition: "all 0.2s linear",
              color: "white",
            },
          }}
          endIcon={
            <ArrowForwardIcon
              sx={{
                color: "white",
                mb: 0.8,
                }}
            />
          }
        >
          <Typography
            variant={"h3"}
            sx={{
              alignSelf: "flex-start",
              textTransform: "none",
            }}
          >{`Join this room`}</Typography>
        </Button>

        {user._id === createdBy._id && (
          <Tooltip title={"Delete this room?"}>
            <IconButton
              sx={{
                alignSelf: "flex-end",
                width: "40px",
              }}
              onClick={handleDelete}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

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
