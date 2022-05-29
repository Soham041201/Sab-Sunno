import { doc, DocumentData, DocumentSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const GetData = async (email: string, collectionName: string, callback: (arg0: DocumentSnapshot<DocumentData>) => void) => {
  const docRef = doc(db, collectionName, email);
  const docSnap = await getDoc(docRef);
  callback(docSnap);
};

export default GetData;
