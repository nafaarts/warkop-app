import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { FIREBASE_AUTH, FIREBASE_STORE } from "../firebase/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, setDoc } from "firebase/firestore";

const handleLogin = async (set, email, password, deviceToken) => {
    set({ loading: true });

    const userCredential = await signInWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
    );

    const user = userCredential.user;
    const customClaims = await user.getIdTokenResult();

    if (customClaims) {
        const userData = {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            role: customClaims.claims.account_level,
        };

        set({ loading: false, user: userData });

        if (deviceToken) {
            const getCurrentToken = await getDoc(
                doc(FIREBASE_STORE, "devices", userData.uid)
            );

            await setDoc(doc(FIREBASE_STORE, "devices", userData.uid), {
                deviceToken: [
                    ...(getCurrentToken.data()?.deviceToken || []),
                    deviceToken,
                ],
            });
        }
    }

    set({ loading: false });
};

const handleLogout = async (set, uid, deviceToken) => {
    if (uid) {
        const getCurrentToken = await getDoc(
            doc(FIREBASE_STORE, "devices", uid)
        );
        const tokens = getCurrentToken
            .data()
            ?.deviceToken?.filter((token) => token !== deviceToken);

        await setDoc(doc(FIREBASE_STORE, "devices", uid), {
            deviceToken: tokens ?? null,
        });

        await signOut(FIREBASE_AUTH);
    }

    set({ user: null });
};

const useAuth = create(
    devtools(
        persist(
            (set) => ({
                user: null,
                loading: false,
                login: async ({ email, password, deviceToken }) =>
                    await handleLogin(set, email, password, deviceToken),
                logout: async (uid, deviceToken) =>
                    await handleLogout(set, uid, deviceToken),
            }),
            {
                name: "auth-data",
                storage: createJSONStorage(() => ReactNativeAsyncStorage),
            }
        )
    )
);

export default useAuth;
