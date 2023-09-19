import { Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const SecondaryButton = ({ label, icon, onPress, disabled, loading }) => {
    return (
        <Pressable
            className="flex-row justify-center px-4 py-3 rounded-md bg-gray-300"
            style={{ gap: 10 }}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#000" />
            ) : (
                <>
                    {icon && <FontAwesome name={icon} size={18} />}
                    <Text className="uppercase font-medium">{label}</Text>
                </>
            )}
        </Pressable>
    );
};

export default SecondaryButton;
