import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface notificationsState {
  open: boolean;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

const initialState: notificationsState = {
  open: false,
  message: '',
  type: 'success',
};

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotification: (state: { open: boolean; message: any; type: any; }, action: { payload: { message: any; type: any; }; }) => {
      const { message, type } = action.payload;
      state.open = true;
      state.message = message;
      state.type = type;
    },
    closeNotification: (state: { open: boolean; }) => {
      state.open = false;
    },
  },
});

export const { setNotification, closeNotification } =
  notificationsSlice.actions;

export const notificationSelector = (state: RootState) => state.notification as notificationsState;

export default notificationsSlice.reducer;
