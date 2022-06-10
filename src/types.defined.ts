export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoURL: string;
  username: string;
  isAuthenticated: boolean
};

type RoomAdd = {
  isMuted: boolean;
};

export type RoomUser = User & RoomAdd;

export enum Theme {
  light = "light",
  dark = "dark",
}
