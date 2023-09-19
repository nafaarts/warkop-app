import React from "react";
import { Stack } from "expo-router";

const ChefLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#eab308",
                },
            }}
        >
            <Stack.Screen
                name="chef-menu"
                options={{
                    title: "Data Menu",
                }}
            />
            <Stack.Screen
                name="chef-pesanan"
                options={{
                    title: "Data Pesanan",
                }}
            />
            <Stack.Screen
                name="chef-pesanan-detail"
                options={{
                    title: "Detail Pesanan",
                }}
            />
        </Stack>
    );
};

export default ChefLayout;
