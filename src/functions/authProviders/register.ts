import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { app } from "../../firebase/firebase";

const RegisterUsingEmailAndPassword = async (
  email: string,
  password: string,
  callback: (data: any) => any
) => {
  const auth = getAuth(app);
  await createUserWithEmailAndPassword(auth, email, password)
    .then((user) => {
      callback(user);
    })
    .catch((error) => {
      console.log(error);
    });
};

export default RegisterUsingEmailAndPassword;
