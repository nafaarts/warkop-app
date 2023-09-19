import { View, Text, Image } from "react-native";
import React from "react";
import GuestLayout from "../components/layouts/GuestLayout";
import PrimaryButton from "../components/button/PrimaryButton";
import { router } from "expo-router";
import useNotification, {
    registerForPushNotificationsAsync,
} from "../stores/useNotification";
import useAuth from "../stores/useAuth";

const Index = () => {
    const { user } = useAuth();
    const { setDeviceToken } = useNotification();

    React.useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            setDeviceToken(token)
        );
    }, []);

    return (
        <GuestLayout>
            <View className="flex-1 justify-center items-center">
                <View style={{ marginBottom: 50 }}>
                    <Image
                        source={require("../assets/logo.png")}
                        className="mb-7 mx-auto"
                    />
                    <Text className="text-center mb-2 text-gray-300">
                        Selamat Datang di
                    </Text>
                    <Text className="text-center font-bold text-2xl text-white">
                        The Radja Kuphie
                    </Text>
                </View>
                <View className="w-full mb-4">
                    <View className="mb-4">
                        <PrimaryButton
                            label="Pelayan"
                            icon="user"
                            style={{ marginBottom: 5 }}
                            onPress={() => router.push("waiters-dashboard")}
                        />
                    </View>
                    <PrimaryButton
                        label="Login"
                        icon="sign-in"
                        onPress={() => router.push("login")}
                    />
                </View>
                <Text className="text-xs text-gray-400">
                    @ The Radja Kuphie
                </Text>
            </View>
        </GuestLayout>
    );
};

export default Index;
