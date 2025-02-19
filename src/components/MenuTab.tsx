import Logout from '@mui/icons-material/Logout';
import Person from '@mui/icons-material/Person';
import Settings from '@mui/icons-material/Settings';
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import Cookies from 'js-cookie';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../redux/slice/userSlice';
import { User } from '../types.defined';

interface MenuTabProps {
  user: User;
}

const MenuTab: FunctionComponent<MenuTabProps> = ({ user }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();

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
          _id: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          photoURL: '',
          username: '',
          isAuthenticated: false,
          about: '',
        },
      })
    );
    Cookies.remove('user-token');
    Cookies.remove('isAuthenticated');
    window.location.href = '/login';
  };

  return (
    <React.Fragment>
      <Tooltip
        title={
          <Typography sx={{ fontFamily: 'Raleway', fontSize: '0.875rem' }}>
            My Account
          </Typography>
        }
        arrow
        TransitionProps={{ timeout: 400 }}
      >
        <IconButton
          onClick={handleClick}
          size='small'
          sx={{
            ml: 2,
            p: 0.5,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-2px) scale(1.05)',
              '& .MuiAvatar-root': {
                borderColor: theme.palette.primary.main,
                boxShadow: `
                  0 4px 8px rgba(0, 0, 0, 0.1),
                  0 2px 4px rgba(255, 132, 19, 0.2)
                `,
              },
            },
          }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar
            src={user.photoURL}
            sx={{
              width: 42,
              height: 42,
              border: '2px solid',
              borderColor: 'rgba(255, 132, 19, 0.6)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backgroundColor: theme.palette.primary.light,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            width: 280,
            overflow: 'visible',
            borderRadius: '12px',
            mt: 1.5,
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: `
              4px 4px 0 rgba(0, 0, 0, 0.05),
              8px 8px 16px rgba(255, 132, 19, 0.12)
            `,
            animation: 'menuFadeIn 0.2s ease-out',
            '@keyframes menuFadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(-8px) scale(0.98)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0) scale(1)',
              },
            },
            '& .MuiMenuItem-root': {
              fontFamily: 'Raleway',
              margin: '4px 8px',
              padding: '10px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 132, 19, 0.08)',
                transform: 'translateX(4px)',
                '& .MuiListItemIcon-root': {
                  transform: 'scale(1.1)',
                },
              },
              '& .MuiListItemIcon-root': {
                minWidth: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                marginRight: '12px',
                transition: 'all 0.2s ease',
                '& svg': {
                  fontSize: '1.25rem',
                },
              },
              '& .MuiTypography-root': {
                fontWeight: 500,
                fontSize: '0.95rem',
              },
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderBottom: 'none',
              borderRight: 'none',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transitionDuration={200}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
            background:
              'linear-gradient(45deg, rgba(255,132,19,0.05) 0%, rgba(255,255,255,1) 100%)',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontWeight: 700,
              color: '#2C3E50',
              fontSize: '1.1rem',
              mb: 0.5,
            }}
          >
            {user.username || `${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Raleway',
              fontSize: '0.875rem',
              color: 'rgba(0, 0, 0, 0.6)',
            }}
          >
            {user.email}
          </Typography>
        </Box>

        <Box sx={{ py: 1.5 }}>
          <MenuItem onClick={() => navigate(`/profile/${user._id}`)}>
            <ListItemIcon>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 132, 19, 0.08)',
                  p: 1,
                  borderRadius: '8px',
                }}
              >
                <Person
                  sx={{
                    color: theme.palette.primary.main,
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>
            </ListItemIcon>
            <Typography>Profile</Typography>
          </MenuItem>

          <MenuItem>
            <ListItemIcon>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 132, 19, 0.08)',
                  p: 1,
                  borderRadius: '8px',
                }}
              >
                <Settings
                  sx={{
                    color: theme.palette.primary.main,
                    transition: 'transform 0.2s ease',
                  }}
                />
              </Box>
            </ListItemIcon>
            <Typography>Settings</Typography>
          </MenuItem>
        </Box>

        <MenuItem
          onClick={handleLogout}
          sx={{
            mt: 1,
            mx: 2,
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: 'rgba(211, 47, 47, 0.08)',
              '& .MuiListItemIcon-root': {
                transform: 'scale(1.1) rotate(4deg)',
                '& .MuiBox-root': {
                  backgroundColor: 'rgba(211, 47, 47, 0.12)',
                },
              },
            },
          }}
        >
          <ListItemIcon>
            <Box
              sx={{
                backgroundColor: 'rgba(211, 47, 47, 0.08)',
                p: 1,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              <Logout
                sx={{
                  color: theme.palette.error.main,
                  transition: 'transform 0.2s ease',
                }}
              />
            </Box>
          </ListItemIcon>
          <Typography>Logout</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default MenuTab;
