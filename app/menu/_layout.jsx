import { Text, Pressable } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import useAuth from "../../stores/useAuth";

export default () => {
    const { user } = useAuth();

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
                    title: "Data Menu",
                    headerRight: () =>
                        user?.role === "chef" ? null : (
                            <Pressable
                                onPress={() => router.push("/menu/create")}
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
                name="create"
                options={{
                    title: "Buat Menu",
                }}
            />
            <Stack.Screen
                name="edit"
                options={{
                    title: "Edit Menu",
                }}
            />
        </Stack>
    );
};
