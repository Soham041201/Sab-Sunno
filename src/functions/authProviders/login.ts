import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "../../firebase/firebase";

export const auth = getAuth(app);

const LoginWithEmail = async (
  email: string,
  password: string,
  callback: (user: any) => any
) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      callback(user);
    })
    .catch((error) => {
      console.log(error);
    });
};

const Logout = async (callback: (user: any) => any) => {
  await signOut(auth)
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.log(error);
    });
};

export { LoginWithEmail, Logout };
