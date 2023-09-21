import { View, Text, ActivityIndicator, Alert } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import AppLayout from "../../components/layouts/AppLayout";
import PrimaryButton from "../../components/button/PrimaryButton";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import useAuth from "../../stores/useAuth";
import { sendPushNotification } from "../../stores/useNotification";
import * as Linking from "expo-linking";
import { FontAwesome } from "@expo/vector-icons";

export default () => {
    const { user } = useAuth();
    const { orderId } = useLocalSearchParams();

    const OrderCollectionRef = collection(FIREBASE_STORE, "orders");

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState([]);

    const IS_CHEF = user?.role === "chef";

    const pesanan =
        user?.role === "chef"
            ? data?.ordersItem.filter((order) => order.chef.uid === user.uid)
            : data?.ordersItem;

    const totalPrice = pesanan?.reduce((total, item) => {
        return item.count * item.price + total;
    }, 0);

    const getData = async () => {
        setLoading(true);
        const data = await getDoc(doc(OrderCollectionRef, orderId));
        setData(data.data());
        setLoading(false);
    };

    const confirmPesanan = () => {
        setData((prev) => {
            prev?.ordersItem?.forEach((order) => {
                if (order.chef.uid === user.uid) {
                    order.served = true;
                }
            });
            return prev;
        });

        Alert.alert("Konfirmasi", "Konfirmasi hidangan anda?", [
            {
                text: "Ya",
                onPress: async () => {
                    await setDoc(doc(OrderCollectionRef, orderId), data);
                    await getData();

                    const url = Linking.createURL("/orders/detail", {
                        queryParams: {
                            orderId: orderId,
                        },
                    });

                    // notif pelayan
                    if (data.waitersDevice !== null) {
                        await sendPushNotification({
                            to: data.waitersDevice,
                            sound: "default",
                            title: "Pesanan telah selesai!",
                            body: `Pesanan ${pesanan
                                .map((order) => order.name)
                                .join(", ")} untuk meja ${
                                data.table
                            } sudah siap dihidangkan!`,
                            data: { url },
                        });
                    }

                    Alert.alert("Berhasil", "Pesanan berhasil dihidangkan!");
                },
            },
            { text: "Tidak", style: "cancel" },
        ]);
    };

    React.useEffect(() => {
        getData();
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
            {IS_CHEF ? (
                <View className="bg-yellow-200 rounded p-3 mb-3">
                    <View className="flex-row items-center justify-between gap-2">
                        <Text>Status Pesanan:</Text>

                        {pesanan[0]?.served ? (
                            <View className="py-1 px-2 rounded-sm bg-green-400">
                                <Text className="italic text-xs">
                                    DIHIDANGKAN
                                </Text>
                            </View>
                        ) : (
                            <View className="py-1 px-2 rounded-sm bg-red-400">
                                <Text className="italic text-xs">
                                    BELUM DIHIDANGKAN
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            ) : (
                <View className="bg-yellow-200 rounded p-3 mb-3">
                    <View className="flex-row items-center justify-between gap-2">
                        <Text>Status Pembayaran:</Text>

                        {data?.paidStatus ? (
                            <View className="py-1 px-2 rounded-sm bg-green-400">
                                <Text className="italic text-xs">DIBAYAR</Text>
                            </View>
                        ) : (
                            <View className="py-1 px-2 rounded-sm bg-red-400">
                                <Text className="italic text-xs">
                                    BELUM DIBAYAR
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            )}

            <View className="bg-yellow-200 rounded p-3 mb-3">
                <View className="space-y-2 mb-4">
                    <View className="flex-row gap-1">
                        <Text>Kostumer:</Text>
                        <Text className="font-bold">{data?.costumer}</Text>
                    </View>
                    <View className="flex-row gap-1">
                        <Text>Meja:</Text>
                        <Text className="font-bold">{data?.table}</Text>
                    </View>
                </View>

                <View className="space-y-3 border-t border-b border-zinc-400 py-3">
                    {pesanan.map((order, index) => {
                        const totalPrice = order.price * order.count;
                        return (
                            <View
                                key={index}
                                className="flex-row justify-between"
                            >
                                <View
                                    className="flex-row items-center"
                                    style={{ gap: 5 }}
                                >
                                    <Text>
                                        {order.name} x{order.count}
                                    </Text>
                                    {order.served ? (
                                        <View className="py-1 px-1 rounded bg-green-400">
                                            <FontAwesome name="check" />
                                        </View>
                                    ) : (
                                        <View className="py-1 px-1 rounded bg-red-400">
                                            <FontAwesome name="times" />
                                        </View>
                                    )}
                                </View>
                                <Text>Rp {totalPrice}</Text>
                            </View>
                        );
                    })}
                </View>

                <View className="flex-row justify-between pt-4">
                    <Text>Total</Text>
                    <Text className="font-bold text-lg">Rp {totalPrice}</Text>
                </View>
            </View>
            {!pesanan[0]?.served && IS_CHEF && (
                <PrimaryButton
                    label="Konfirmasi Hidangan"
                    icon="check"
                    onPress={confirmPesanan}
                />
            )}
        </AppLayout>
    );
};
