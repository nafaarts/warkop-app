import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
} from "react-native";
import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import AppLayout from "../../components/layouts/AppLayout";
import TextInput from "../../components/form/TextInput";
import PrimaryButton from "../../components/button/PrimaryButton";
import { router } from "expo-router";
import SecondaryButton from "../../components/button/SecondaryButton";
import useCart from "../../stores/userCart";

export default () => {
    const { setCostumer, resetCart } = useCart();

    const [table, setTable] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedTable, setSelectedTable] = React.useState(0);
    const [costumerName, setCostumerName] = React.useState({
        value: "",
        error: "",
    });

    const getConfiguration = async () => {
        setLoading(true);
        const configuration = await getDoc(
            doc(FIREBASE_STORE, "configuration", "PZClrv9uUdFL1oDGkqKX")
        );

        if (configuration.exists()) {
            setTable(parseInt(configuration.data().table_count));
        }
        setLoading(false);
    };

    const createOrder = () => {
        if (!costumerName.value) {
            setCostumerName({ error: "Masukan nama kostumer!" });
            return;
        }

        setCostumer({
            costumer: costumerName.value,
            table: selectedTable,
        });

        router.replace("/waiters/cart");
    };

    React.useEffect(() => {
        getConfiguration();
        resetCart();
    }, []);

    if (loading) {
        return (
            <AppLayout>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator size="large" color="#fff" />
                </View>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <ScrollView
                contentContainerStyle={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                }}
            >
                {[...Array(table)].map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            className="w-1/3 p-1"
                            onPress={() => {
                                setIsModalOpen(true);
                                setCostumerName({ error: "" });
                                setSelectedTable(i + 1);
                            }}
                        >
                            <View className="bg-yellow-200 py-5 rounded">
                                <Text className="font-bold text-center text-lg">
                                    Meja {i + 1}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            <Modal
                visible={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                animationType="slide"
            >
                <AppLayout>
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-lg text-white mb-6">
                            Buat Pesanan Meja {selectedTable}
                        </Text>

                        <View className="w-full">
                            <TextInput
                                label="Nama Kostumer"
                                placeholder="Masukan nama kostumer"
                                error={costumerName.error}
                                onChangeText={(value) =>
                                    setCostumerName({ value })
                                }
                            />
                            <View style={{ gap: 10 }}>
                                <PrimaryButton
                                    label="Buat Pesanan"
                                    onPress={createOrder}
                                />
                                <SecondaryButton
                                    label="Batal"
                                    onPress={() => {
                                        setIsModalOpen(false);
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </AppLayout>
            </Modal>
        </AppLayout>
    );
};
