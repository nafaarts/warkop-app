import { Stack, router } from "expo-router";
import useAuth from "../stores/useAuth";
import React, { useRef } from "react";
import { FIREBASE_AUTH } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

import * as Notifications from "expo-notifications";
import * as Linking from "expo-linking";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

const Layout = () => {
    const { user, logout } = useAuth();

    const notificationListener = useRef();
    const responseListener = useRef();

    React.useEffect(() => {
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log("buka notif", notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(
                        JSON.stringify(
                            response.notification.request.content.data,
                            null,
                            2
                        )
                    );
                    Linking.openURL(
                        response.notification.request.content.data.url
                    );
                }
            );

        return () => {
            Notifications.removeNotificationSubscription(
                notificationListener.current
            );
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
                if (user) {
                    logout();
                }

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
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="waiters-dashboard" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(users)" />
            <Stack.Screen name="(menu)" />
            <Stack.Screen name="(config)" />
            <Stack.Screen name="(chef)" />
        </Stack>
    );
};

export default Layout;
