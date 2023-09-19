import { View, Text, Alert, Image, FlatList, Pressable } from "react-native";
import React from "react";
import GuestLayout from "../components/layouts/GuestLayout";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import useCart from "../stores/userCart";

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

const WaitersDashboard = () => {
    const { resetCart } = useCart();

    React.useEffect(() => {
        resetCart();
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
                        Pelayanan
                    </Text>
                    <Text className="text-center font-bold text-2xl text-white">
                        The Radja Kuphie
                    </Text>
                </View>
                <View className="w-full mb-4">
                    <NavCard
                        title="Buat Pesanan"
                        icon="md-add"
                        onPress={() => router.push("/waiters-tables")}
                    />
                    <NavCard
                        title="Riwayat Pesanan"
                        icon="reorder-three"
                        onPress={() => router.push("/waiters-history")}
                    />
                    <NavCard
                        title="Kembali"
                        icon="arrow-back"
                        onPress={() => router.replace("/")}
                    />
                </View>
                <Text className="text-xs text-gray-400">
                    @ The Radja Kuphie
                </Text>
            </View>
        </GuestLayout>
    );
};

export default WaitersDashboard;
