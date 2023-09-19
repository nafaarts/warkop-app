import { Stack } from "expo-router";
import React from "react";

const OrdersLayout = () => {
    return (
        <Stack
            initialRouteName="orders-tables"
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
                name="orders-tables"
                options={{
                    title: "Meja",
                }}
            />
            <Stack.Screen
                name="orders-index"
                options={{
                    title: "Daftar Pesanan",
                }}
            />
            <Stack.Screen
                name="orders-detail"
                options={{
                    title: "Detail Pesanan",
                }}
            />
        </Stack>
    );
};

export default OrdersLayout;
