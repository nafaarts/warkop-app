import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_STORAGE } from "../firebase/firebase";

const uploadToFirebase = async (uri, name, onProgress) => {
    const fetchResponse = await fetch(uri);
    const theBlob = await fetchResponse.blob();

    const imageRef = ref(FIREBASE_STORAGE, name);
    const uploadTask = uploadBytesResumable(imageRef, theBlob);

    return new Promise((resolve, reject) => {
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                onProgress && onProgress(progress);
            },
            (error) => {
                reject(error);
            },
            async () => {
                const downloadUrl = await getDownloadURL(
                    uploadTask.snapshot.ref
                );
                resolve({
                    downloadUrl,
                    metadata: uploadTask.snapshot.metadata,
                });
            }
        );
    });
};

export default uploadToFirebase;
