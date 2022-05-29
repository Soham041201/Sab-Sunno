import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const PostData = async (data: { email: any; }, docName: any, callback: (arg0: void) => void) => {
  await setDoc(doc(db, `${docName}`, `${data.email}`), data)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default PostData;


