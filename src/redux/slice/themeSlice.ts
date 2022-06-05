import { createSlice } from "@reduxjs/toolkit";
import { Theme } from "../../types.defined";

interface ThemeState {
  theme: Theme;
}

const initialState: ThemeState = {
  theme: Theme.dark,
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state: { theme: Theme }, action: { payload: Theme }) => {
      const theme = action.payload;
      state.theme = theme;
    },
  },
});

export const { setTheme } = themeSlice.actions;

export default themeSlice.reducer;
