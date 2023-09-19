import { View, Text, KeyboardAvoidingView, Alert } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import TextInput from "../../components/form/TextInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import Select from "../../components/form/Select";
import { router, useLocalSearchParams } from "expo-router";
import { editUser } from "../../services/user";

const UserEdit = () => {
    const { userUid, userName, userEmail, userRole } = useLocalSearchParams();

    const [loading, setLoading] = React.useState(false);
    const [name, setName] = React.useState({ value: userName, error: "" });
    const [email, setEmail] = React.useState({ value: userEmail, error: "" });
    const [role, setRole] = React.useState(userRole || "");
    const [roleError, setRoleError] = React.useState("");
    const [password, setPassword] = React.useState({ value: "", error: "" });

    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState([
        { label: "Admin", value: "admin" },
        { label: "Kasir", value: "cashier" },
        { label: "Chef", value: "chef" },
    ]);

    const handleUpdateUser = async () => {
        if (!name.value || !email.value || !role) {
            if (!name.value) {
                setName({ error: "Nama harus diisi!" });
            }
            if (!email.value) {
                setEmail({ error: "Email harus diisi!" });
            }
            if (!role) {
                setRoleError("Hak Akses harus diisi!");
            }
            return;
        }

        setLoading(true);
        try {
            const data = {
                uid: userUid,
                email: email.value,
                displayname: name.value,
                account_level: role,
            };

            if (password.value) {
                data.password = password.value;
            }

            const response = await editUser(data);
            if (response) {
                Alert.alert("Berhasil", "User berhasil diedit!");
                router.replace("/user-index");
            }

            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error?.message);
            setLoading(false);
        }

        return;
    };

    React.useEffect(() => {
        if (!userUid || !userName || !userEmail || !userRole) {
            router.replace("/user-index");
        }
    }, []);

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
                    onPress={handleUpdateUser}
                    loading={loading}
                />
            </KeyboardAvoidingView>
        </AppLayout>
    );
};

export default UserEdit;
