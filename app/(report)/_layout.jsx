import { Stack } from "expo-router";
import React from "react";

const ReportLayout = () => {
    return (
        <Stack
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
                name="report-index"
                options={{
                    title: "Laporan",
                }}
            />
        </Stack>
    );
};

export default ReportLayout;
