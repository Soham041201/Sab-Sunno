import { combineReducers } from "@reduxjs/toolkit";
import notificationSlice from "./slice/notificationSlice";
import themeSlice from "./slice/themeSlice";
import userSlice from "./slice/userSlice";

const rootReducer = combineReducers({
  user: userSlice,
  notification: notificationSlice,
  theme : themeSlice,
});

export default rootReducer;
