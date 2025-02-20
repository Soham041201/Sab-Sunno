export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoURL?: string;
  username: string;
  isAuthenticated: boolean;
  about: string;
}

export interface RoomUser extends User {
  isMuted: boolean;
}

export enum Theme {
  light = 'light',
  dark = 'dark',
}
