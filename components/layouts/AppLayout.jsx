import { SafeAreaView, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const AppLayout = ({ children, ...props }) => {
    return (
        <SafeAreaView
            className="flex-1 bg-zinc-800"
            style={{
                paddingHorizontal: 15,
            }}
            {...props}
        >
            <StatusBar style="light" />
            <View className="flex-1 py-3">{children}</View>
        </SafeAreaView>
    );
};

export default AppLayout;
