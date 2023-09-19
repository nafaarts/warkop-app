import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Pressable } from "react-native";

const SmallButton = ({ icon, onPress, ...props }) => {
    return (
        <Pressable onPress={onPress} className="p-2 rounded" {...props}>
            <FontAwesome name={icon} size={14} color="#fff" />
        </Pressable>
    );
};

export default SmallButton;
