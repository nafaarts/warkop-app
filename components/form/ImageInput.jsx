import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    ActivityIndicator,
} from "react-native";
import React from "react";
import ImagePlaceholder from "../../assets/img-placeholder.jpg";
import * as ImagePicker from "expo-image-picker";

const ImageInput = ({ label, error, imgSource, loading, onPick }) => {
    const [imageSource, setImageSource] = React.useState(
        imgSource || ImagePlaceholder
    );

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImageSource({
                uri: result.assets[0].uri,
            });

            onPick(result);
        }
    };

    return (
        <View className="space-y-2 mb-4">
            {label && <Text className="text-xs text-white">{label}</Text>}

            <TouchableOpacity
                className="rounded overflow-hidden"
                onPress={pickImage}
                disabled={loading}
            >
                <ImageBackground
                    source={imageSource}
                    style={{
                        height: 300,
                    }}
                >
                    {loading && (
                        <View className="justify-center items-center h-full bg-black/50">
                            <ActivityIndicator size="large" color="#fff" />
                        </View>
                    )}
                </ImageBackground>
            </TouchableOpacity>

            {error && <Text className="text-xs text-red-500">{error}</Text>}
        </View>
    );
};

export default ImageInput;
