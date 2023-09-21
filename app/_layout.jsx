import React from "react";

import { Stack, router } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

import { FIREBASE_AUTH } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export default () => {
    const responseListener = React.useRef();

    React.useEffect(() => {
        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    Linking.openURL(
                        response.notification.request.content.data.url
                    );
                }
            );

        return () => {
            Notifications.removeNotificationSubscription(
                responseListener.current
            );
        };
    }, []);

    React.useEffect(() => {
        onAuthStateChanged(FIREBASE_AUTH, (loggedUser) => {
            if (loggedUser) {
                router.replace("/dashboard");
            } else {
                router.replace("/");
            }
        });
    }, []);

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="index" />
        </Stack>
    );
};
