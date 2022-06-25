import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import * as React from "react";
import { FunctionComponent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slice/userSlice";
import { User } from "../types.defined";

interface MenuTabProps {
  user: User;
}

const MenuTab: FunctionComponent<MenuTabProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(
      setUser({
        user: {
          _id: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          photoURL: "",
          username: "",
          isAuthenticated: false,
          about: "",
        },
      })
    );
    Cookies.remove("user-token");
    Cookies.remove("isAuthenticated");
    window.location.href = "/login";
  };

  return (
    <React.Fragment>
      <Tooltip title={<Typography variant={"body2"}>My Account</Typography>}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar src={user.photoURL} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => navigate(`/profile/${user._id}`)}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <Typography
            variant={"body1"}
            sx={{
              color: "gray",
            }}
          >
            {user.username ? user.username : `My account`}
          </Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <Typography
            variant={"body1"}
            sx={{
              color: "gray",
            }}
          >
            Settings
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          <Typography
            variant={"body1"}
            sx={{
              color: "gray",
            }}
          >
            Logout
          </Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default MenuTab;
