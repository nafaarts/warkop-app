import { SafeAreaView, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";

const GuestLayout = ({ children }) => {
  return (
    <SafeAreaView className="flex-1 bg-zinc-800 px-3">
      <StatusBar style="light" />
      <View className="flex-1 min-w-[340px] mx-auto">{children}</View>
    </SafeAreaView>
  );
};

export default GuestLayout;
