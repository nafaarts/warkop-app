import { View, KeyboardAvoidingView, Alert } from "react-native";
import React from "react";
import { router } from "expo-router";
import { min, validateEmail } from "../../utils/validation";
import { createUser } from "../../services/user";

import AppLayout from "../../components/layouts/AppLayout";
import TextInput from "../../components/form/TextInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import Select from "../../components/form/Select";

export default () => {
    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState({ value: "", error: "" });
    const [email, setEmail] = React.useState({ value: "", error: "" });
    const [role, setRole] = React.useState("");
    const [roleError, setRoleError] = React.useState("");
    const [password, setPassword] = React.useState({ value: "", error: "" });

    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState([
        { label: "Admin", value: "admin" },
        { label: "Kasir", value: "cashier" },
        { label: "Chef", value: "chef" },
    ]);

    const handleCreateUser = async () => {
        if (!name.value) {
            setName((prev) => ({ ...prev, error: "Nama harus diisi!" }));
            return;
        }

        if (!email.value) {
            setEmail((prev) => ({ ...prev, error: "Email harus diisi!" }));
            return;
        }

        if (!validateEmail(email.value)) {
            setEmail((prev) => ({ ...prev, error: "Email harus valid!" }));
            return;
        }

        if (!role) {
            setRoleError("Hak Akses harus diisi!");
            return;
        }

        if (!password.value) {
            setPassword((prev) => ({
                ...prev,
                error: "Password harus diisi!",
            }));
            return;
        }

        if (!min(password.value, 8)) {
            setPassword((prev) => ({
                ...prev,
                error: "Password tidak boleh kurang dari 8 digit!",
            }));
            return;
        }

        setLoading(true);
        try {
            const data = {
                email: email.value,
                displayname: name.value,
                account_level: role,
                password: password.value,
            };

            const response = await createUser(data);
            if (response) {
                Alert.alert("Berhasil", "User berhasil ditambahkan!");
                router.replace("/users");
            }

            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error?.message);
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <KeyboardAvoidingView behavior="height">
                <View className="mb-4">
                    <TextInput
                        label="Nama"
                        placeholder="Masukan nama"
                        value={name.value}
                        onChangeText={(value) => setName({ value })}
                        error={name.error}
                    />

                    <TextInput
                        label="Email"
                        placeholder="Masukan email"
                        value={email.value}
                        onChangeText={(value) => setEmail({ value })}
                        error={email.error}
                    />

                    <Select
                        label="Hak Akses"
                        open={open}
                        value={role}
                        items={items}
                        setOpen={setOpen}
                        setValue={(value) => {
                            setRole(value);
                            setRoleError("");
                        }}
                        setItems={setItems}
                        error={roleError}
                    />

                    <TextInput
                        label="Password"
                        placeholder="Masukan password"
                        value={password.value}
                        secureTextEntry
                        onChangeText={(value) => setPassword({ value })}
                        error={password.error}
                    />
                </View>
                <PrimaryButton
                    label="SIMPAN"
                    onPress={handleCreateUser}
                    loading={loading}
                />
            </KeyboardAvoidingView>
        </AppLayout>
    );
};
