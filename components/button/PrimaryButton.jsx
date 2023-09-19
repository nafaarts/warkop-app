import { Text, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const PrimaryButton = ({
    label,
    icon,
    onPress,
    disabled,
    loading,
    ...props
}) => {
    return (
        <Pressable
            className="flex-row justify-center px-4 py-3 rounded-md bg-yellow-500"
            onPress={onPress}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#000" />
            ) : (
                <>
                    {icon && (
                        <FontAwesome
                            name={icon}
                            size={18}
                            style={{ marginRight: 10 }}
                        />
                    )}
                    <Text className="uppercase font-medium">{label}</Text>
                </>
            )}
        </Pressable>
    );
};

export default PrimaryButton;
