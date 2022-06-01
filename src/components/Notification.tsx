import { Alert, Slide, Snackbar } from "@mui/material";
import * as React from "react";
import { FunctionComponent } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  closeNotification,
  notificationSelector,
} from "../redux/slice/notificationSlice";

const Notification: FunctionComponent = () => {
  const dispatch = useDispatch();

  const { open, type, message } = useSelector(notificationSelector);

  return (
    <Snackbar
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      open={open}
      onClose={() => dispatch(closeNotification())}
      TransitionComponent={Slide}
      autoHideDuration={1000}
    >
      <Alert severity={type}>{message}</Alert>
    </Snackbar>
  );
};

export default Notification;
