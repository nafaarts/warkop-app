import { View, Text, Image } from "react-native";
import React from "react";
import GuestLayout from "../components/layouts/GuestLayout";
import PrimaryButton from "../components/button/PrimaryButton";
import { Redirect, router } from "expo-router";
import useNotification, {
    registerForPushNotificationsAsync,
} from "../stores/useNotification";
import useCart from "../stores/userCart";
import useAuth from "../stores/useAuth";

export default () => {
    const { setDeviceToken } = useNotification();
    const { resetCart } = useCart();

    const { user } = useAuth();

    React.useEffect(() => {
        resetCart();

        registerForPushNotificationsAsync().then((token) =>
            setDeviceToken(token)
        );
    }, []);

    return user === null ? (
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
                    <PrimaryButton
                        label="Buat Pesanan"
                        icon="plus"
                        className="mb-3"
                        onPress={() => router.push("/waiters/tables")}
                    />

                    <PrimaryButton
                        label="Riwayat Pesanan"
                        icon="history"
                        className="mb-3"
                        onPress={() => router.push("/orders")}
                    />

                    <PrimaryButton
                        label="Login"
                        icon="sign-in"
                        onPress={() => router.push("/auth/login")}
                    />
                </View>
                <Text className="text-xs text-gray-400">
                    @ The Radja Kuphie
                </Text>
            </View>
        </GuestLayout>
    ) : (
        <Redirect href="/dashboard" replace />
    );
};
