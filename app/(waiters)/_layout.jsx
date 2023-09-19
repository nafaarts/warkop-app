import { Stack } from "expo-router";
import React from "react";

const WaitersLayout = () => {
    return (
        <Stack
            initialRouteName="waiters-tables"
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#eab308",
                },
                tabBarStyle: {
                    backgroundColor: "#eab308",
                },
                tabBarActiveTintColor: "#fff",
                tabBarInactiveTintColor: "#d3d3d3",
            }}
        >
            <Stack.Screen
                name="waiters-tables"
                options={{
                    title: "Buat Pesanan",
                }}
            />
            <Stack.Screen
                name="waiters-menu"
                options={{
                    title: "Daftar Menu",
                }}
            />
            <Stack.Screen
                name="waiters-cart"
                options={{
                    title: "Daftar Pesanan",
                }}
            />
            <Stack.Screen
                name="waiters-history"
                options={{
                    title: "Riwayat Pesanan",
                }}
            />
            <Stack.Screen
                name="waiters-history-detail"
                options={{
                    title: "Detail Pesanan",
                }}
            />
        </Stack>
    );
};

export default WaitersLayout;
