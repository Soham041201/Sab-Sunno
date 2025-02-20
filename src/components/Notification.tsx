import { Alert, Slide, Snackbar } from '@mui/material';
import { FunctionComponent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeNotification,
  notificationSelector,
} from '../redux/slice/notificationSlice';
import { TransitionProps } from '@mui/material/transitions';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationState {
  open: boolean;
  type: NotificationType;
  message: string;
}
const SlideTransition = (
  props: TransitionProps & { children: React.ReactElement }
) => {
  return (
    <Slide {...props} direction='down'>
      {props.children}
    </Slide>
  );
};

const Notification: FunctionComponent = () => {
  const dispatch = useDispatch();

  const { open, type, message } = useSelector(
    notificationSelector
  ) as NotificationState;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open) {
      timer = setTimeout(() => {
        dispatch(closeNotification());
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open, dispatch]);

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      open={open}
      onClose={() => dispatch(closeNotification())}
      TransitionComponent={SlideTransition}
      autoHideDuration={3000}
      sx={{
        '& .MuiAlert-root': {
          width: '100%',
          maxWidth: 400,
        },
      }}
    >
      <Alert
        severity={type}
        variant='filled'
        onClose={() => dispatch(closeNotification())}
        elevation={6}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
