import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types.defined";
import { RootState } from "../store";

interface userState {
  user: User;
}

const initialState: userState = {
  user: {
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    photoURL: "",
    username: "",
  },
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: { user: User }, action: { payload: { user: User } }) => {
      const { user } = action.payload;
      state.user = user;
    },
  },
});

export const { setUser } = usersSlice.actions;

export const userPictureSelector = (state: RootState) =>
  state.user.user.photoURL;
export const userNameSelector = (state: RootState) => state.user.user.firstName;

export const selectUser = (state: RootState) => state.user.user;

export default usersSlice.reducer;
