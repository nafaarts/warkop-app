import React from "react";
import { Stack } from "expo-router";

const ConfigLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#eab308",
                },
            }}
        >
            <Stack.Screen
                name="configuration"
                options={{
                    title: "Konfigurasi",
                }}
            />
        </Stack>
    );
};

export default ConfigLayout;
