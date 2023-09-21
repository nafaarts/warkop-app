import React from "react";
import { Stack } from "expo-router";

export default () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#eab308",
                },
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    title: "Jumlah Meja",
                }}
            />
        </Stack>
    );
};
