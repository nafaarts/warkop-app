import {
    addDoc,
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import uploadToFirebase from "../utils/uploadToFirebase";
import { FIREBASE_STORE } from "../firebase/firebase";

const menuCollectionRef = collection(FIREBASE_STORE, "menu");

const getMenuById = async (uid) => {
    const response = await getDoc(doc(menuCollectionRef, uid));
    return response;
};

const createMenu = async (data, image, uploadProgress) => {
    const fileName = image.uri.split("/").pop();
    const uploadResp = await uploadToFirebase(
        image.uri,
        image.path + fileName,
        (v) => uploadProgress(v)
    );

    if (uploadResp) {
        const docRef = await addDoc(menuCollectionRef, {
            name: data.name,
            category: data.category,
            price: data.price,
            description: data.description,
            chef: data.chef,
            image: {
                url: uploadResp.downloadUrl,
                path: uploadResp.metadata.fullPath,
            },
        });

        return docRef;
    }
};

const updateMenu = async (uid, data, image, uploadProgress) => {
    const updateData = {
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        chef: data.chef,
    };

    if (image) {
        const fileName = image.uri.split("/").pop();
        const uploadResp = await uploadToFirebase(
            image.uri,
            image.path + fileName,
            (v) => uploadProgress(v)
        );

        updateData.image = {
            url: uploadResp.downloadUrl,
            path: uploadResp.metadata.fullPath,
        };
    }

    const docRef = await updateDoc(doc(menuCollectionRef, uid), updateData);

    return docRef;
};

export { getMenuById, createMenu, updateMenu };
