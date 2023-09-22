import { Stack } from "expo-router";
import React from "react";

export default () => {
    return (
        <Stack
            initialRouteName="tables"
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
                name="tables"
                options={{
                    title: "Buat Pesanan",
                }}
            />
            <Stack.Screen
                name="cart"
                options={{
                    title: "Pesanan",
                }}
            />
            <Stack.Screen
                name="menu"
                options={{
                    title: "Data Menu",
                }}
            />
        </Stack>
    );
};
