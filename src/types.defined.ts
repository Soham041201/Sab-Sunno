type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoURL: string;
  username: string;
};

type RoomAdd = {
  isMuted: boolean;
};

export type RoomUser = User & RoomAdd;

export default User;
