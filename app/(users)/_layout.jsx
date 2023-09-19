import { View, Text, Pressable, Button } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const UserLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#eab308",
                },
            }}
        >
            <Stack.Screen
                name="user-index"
                options={{
                    title: "Manajemen User",

                    headerRight: () => (
                        <Pressable
                            onPress={() => router.push("user-create")}
                            className="flex-row items-center py-1 px-2 bg-yellow-400 rounded"
                            style={{ margin: 2, gap: 5 }}
                        >
                            <Text>TAMBAH</Text>
                            <FontAwesome name="plus" size={16} />
                        </Pressable>
                    ),
                }}
            />
            <Stack.Screen
                name="user-create"
                options={{
                    title: "Buat User",
                }}
            />
            <Stack.Screen
                name="user-edit"
                options={{
                    title: "Edit User",
                }}
            />
        </Stack>
    );
};

export default UserLayout;
