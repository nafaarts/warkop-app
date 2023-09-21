import { View, Text, Image } from "react-native";
import React from "react";
import GuestLayout from "../../components/layouts/GuestLayout";
import TextInput from "../../components/form/TextInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import { router } from "expo-router";
import SecondaryButton from "../../components/button/SecondaryButton";
import { min, validateEmail } from "../../utils/validation";
import useAuth from "../../stores/useAuth";
import useNotification from "../../stores/useNotification";

export default () => {
    const { user, login } = useAuth();
    const { deviceToken } = useNotification();

    const [loading, setLoading] = React.useState(false);

    const [email, setEmail] = React.useState({
        value: "",
        error: "",
    });

    const [password, setPassword] = React.useState({
        value: "",
        error: "",
    });

    const onSubmit = async () => {
        if (!email.value) {
            setEmail((prev) => ({ ...prev, error: "Email wajib diisi!" }));
            return;
        }

        if (!validateEmail(email.value)) {
            setEmail((prev) => ({ ...prev, error: "Email harus valid!" }));
            return;
        }

        if (!password.value) {
            setPassword({ error: "Password wajib diisi!" });
            return;
        }

        if (!min(password.value, 8)) {
            setPassword({ error: "Password tidak boleh kurang dari 8 digit!" });
            return;
        }

        setLoading(true);
        try {
            await login({
                email: email.value,
                password: password.value,
                deviceToken,
            });
            setLoading(false);
        } catch (error) {
            setEmail({ error: "Email / password salah!" });
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (user) {
            router.replace("/dashboard");
        }
    });

    return (
        <GuestLayout>
            <View className="flex-1 justify-center items-center">
                <View style={{ marginBottom: 50 }}>
                    <Image
                        source={require("../../assets/logo.png")}
                        className="mb-7"
                    />
                    <Text className="text-center font-bold text-2xl text-white">
                        MASUK
                    </Text>
                </View>
                <View className="mb-3 w-full">
                    <TextInput
                        label="Alamat Email"
                        placeholder="Masukan alamat email anda"
                        error={email.error}
                        value={email.value}
                        onChangeText={(value) => setEmail({ value })}
                    />
                    <TextInput
                        label="Password"
                        placeholder="Masukan password anda"
                        value={password.value}
                        error={password.error}
                        onChangeText={(value) => setPassword({ value })}
                        secureTextEntry
                    />
                </View>
                <View className="w-full mb-4">
                    <View className="mb-3">
                        <PrimaryButton
                            label="Masuk ke akun anda"
                            icon="sign-in"
                            loading={loading}
                            onPress={onSubmit}
                        />
                    </View>
                    <SecondaryButton
                        label="Kembali"
                        icon="arrow-left"
                        onPress={() => router.back()}
                    />
                </View>
                <Text className="text-xs text-gray-400">
                    @ The Radja Kuphie
                </Text>
            </View>
        </GuestLayout>
    );
};
