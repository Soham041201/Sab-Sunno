import { storage } from "../../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadImage =async  (
  e: {
    target: any;
    preventDefault: () => void;
  },
  callback: (arg0: string) => void
) => {
  e.preventDefault();  
  const refer = ref(storage, `/images/${e.target.files[0].name}`);
  await uploadBytes(refer, e.target.files[0])
    .then((snapshot) => {
      console.log(snapshot)
    })
    .then(async () => {
      await getDownloadURL(ref(storage, `images/${e.target.files[0].name}`)).then(
        (url) => {
          callback(url);
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
};
export default UploadImage;
