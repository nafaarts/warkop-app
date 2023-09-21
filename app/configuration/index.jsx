import { View, Text, Alert } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import TextInput from "../../components/form/TextInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";

export default () => {
    const [loading, setLoading] = React.useState(false);
    const [tableCount, setTableCount] = React.useState({
        value: "",
        error: "",
    });

    const docRef = doc(FIREBASE_STORE, "configuration", "PZClrv9uUdFL1oDGkqKX");

    const getData = async () => {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setTableCount({ value: docSnap.data()?.table_count.toString() });
        } else {
            console.log("No such document!");
        }
    };

    const handleSaveConfig = async () => {
        if (!tableCount.value) {
            setTableCount({ error: "Jumlah meja wajib diisi!" });
            return;
        }

        try {
            setLoading(true);
            await updateDoc(docRef, {
                table_count: tableCount.value,
            });

            setLoading(false);
            Alert.alert("Berhasil", "Konfigurasi berhasil diubah!");
        } catch (error) {
            Alert.alert("Terjadi kesalahan", error?.code);
            setLoading(false);
        }
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <AppLayout>
            <View className="mb-2">
                <TextInput
                    label="Jumlah Meja"
                    placeholder="Masukan jumlah meja"
                    error={tableCount.error}
                    value={tableCount.value}
                    onChangeText={(value) => setTableCount({ value })}
                    keyboardType="numeric"
                />
            </View>
            <PrimaryButton
                label="SIMPAN"
                onPress={handleSaveConfig}
                loading={loading}
            />
        </AppLayout>
    );
};
