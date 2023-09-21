import { View, Text, Alert, Image, Pressable } from "react-native";
import React from "react";
import GuestLayout from "../components/layouts/GuestLayout";
import useAuth from "../stores/useAuth";
import { Redirect, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useNotification from "../stores/useNotification";

export default () => {
    const { user, logout } = useAuth();
    const { deviceToken } = useNotification();

    const IS_ADMIN = user?.role === "admin";
    const IS_CHEF = user?.role === "chef";
    const IS_CASHIER = user?.role === "cashier";

    const handleLogout = () => {
        Alert.alert("Logout", "Apakah anda yakin untuk keluar?", [
            {
                text: "Ya",
                style: "default",
                onPress: () => logout(user?.uid, deviceToken),
            },
            { text: "Tidak", style: "cancel" },
        ]);
    };

    return user !== null ? (
        <GuestLayout>
            <View className="flex-1 justify-center items-center">
                <View style={{ marginBottom: 50 }}>
                    <Image
                        source={require("../assets/logo.png")}
                        className="mb-7 mx-auto"
                    />
                    <Text className="text-center mb-2 text-gray-300">
                        Selamat Datang, {user?.name}
                    </Text>
                    <Text className="text-center font-bold text-2xl text-white">
                        The Radja Kuphie
                    </Text>
                </View>
                <View className="w-full mb-4">
                    {IS_CASHIER && (
                        <NavCard
                            title="Pembayaran Pesanan"
                            icon="cart"
                            onPress={() => {
                                router.push("/cashier/tables");
                            }}
                        />
                    )}

                    {(IS_ADMIN || IS_CASHIER) && (
                        <NavCard
                            title="Laporan Penjualan"
                            icon="md-bar-chart"
                            onPress={() => {
                                router.push("/report");
                            }}
                        />
                    )}

                    {IS_CHEF && (
                        <NavCard
                            title="Pesanan"
                            icon="cart"
                            onPress={() => {
                                router.push("/orders");
                            }}
                        />
                    )}

                    {IS_CHEF && (
                        <NavCard
                            title="Data Menu"
                            icon="fast-food"
                            onPress={() => {
                                router.push("/menu");
                            }}
                        />
                    )}

                    {IS_ADMIN && (
                        <NavCard
                            title="Manajemen User"
                            icon="people"
                            onPress={() => {
                                router.push("/users");
                            }}
                        />
                    )}
                    {IS_ADMIN && (
                        <NavCard
                            title="Manajemen Menu"
                            icon="fast-food"
                            onPress={() => {
                                router.push("/menu");
                            }}
                        />
                    )}
                    {IS_ADMIN && (
                        <NavCard
                            title="Jumlah Meja"
                            icon="grid"
                            onPress={() => {
                                router.push("/configuration");
                            }}
                        />
                    )}
                    <NavCard
                        title="Keluar"
                        icon="log-out"
                        onPress={handleLogout}
                    />
                </View>
                <Text className="text-xs text-gray-400">
                    @ The Radja Kuphie
                </Text>
            </View>
        </GuestLayout>
    ) : (
        <Redirect href="/" replace />
    );
};

const NavCard = ({ title, icon, onPress }) => {
    return (
        <Pressable
            className="flex-row items-center px-6 py-4 bg-yellow-500 w-full mb-3 rounded-md"
            style={{ gap: 10 }}
            onPress={onPress}
        >
            <Ionicons name={icon} size={18} />
            <Text>{title}</Text>
        </Pressable>
    );
};
