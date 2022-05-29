import { createSlice } from "@reduxjs/toolkit";
import User from "../../types.defined";

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
  name: "userData",
  initialState,
  reducers: {
    setUser: (state: { user: User }, action: { payload: { user: User } }) => {
      const { user } = action.payload;
      state.user = user;
    },
  },
});

export const { setUser } = usersSlice.actions;

export default usersSlice.reducer;
