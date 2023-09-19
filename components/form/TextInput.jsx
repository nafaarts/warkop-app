import { View, Text, TextInput as Input } from "react-native";
import React from "react";

const TextInput = ({ label, error, ...props }) => {
    return (
        <View className="space-y-2 mb-4">
            {label && <Text className="text-xs text-white">{label}</Text>}
            <View className="px-3 py-3 bg-gray-300 rounded-md">
                <Input {...props} />
            </View>
            {error && <Text className="text-xs text-red-500">{error}</Text>}
        </View>
    );
};

export default TextInput;
