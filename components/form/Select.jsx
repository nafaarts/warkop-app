import React from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { Text, View } from "react-native";

const Select = ({ label, placeholder, info, error, ...props }) => {
    // const [open, setOpen] = React.useState(false);
    // const [value, setValue] = React.useState(null);
    // const [items, setItems] = React.useState([
    //     { label: "Apple", value: "apple" },
    //     { label: "Banana", value: "banana" },
    // ]);

    return (
        <View className="space-y-2 mb-4">
            {label && <Text className="text-xs text-white">{label}</Text>}
            <DropDownPicker
                // open={open}
                // value={value}
                // items={items}
                // setOpen={setOpen}
                // setValue={setValue}
                // setItems={setItems}
                placeholder={placeholder || "Pilih item"}
                className="border border-gray-300 rounded-md px-2 py-1 bg-gray-300"
                style={{
                    borderColor: error ? "red" : null,
                }}
                dropDownContainerStyle={{
                    borderColor: "#d1d5db",
                }}
                {...props}
            />
            {info && <Text className="text-xs text-gray-400 mt-1">{info}</Text>}
            {error && (
                <Text className="text-xs text-red-500 mt-1">{error}</Text>
            )}
        </View>
    );
};

export default Select;
