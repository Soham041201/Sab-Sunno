import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../../firebase/firebase";

const GoogleSignIn = async (callback : (user: any)=>void) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  await signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      callback(user)
    })
    .catch((error) => {
      console.log(error)
    });
};

export default GoogleSignIn;