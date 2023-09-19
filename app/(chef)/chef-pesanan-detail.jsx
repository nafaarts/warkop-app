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

const ChefPesananDetail = () => {
    const { user } = useAuth();

    const { orderId } = useLocalSearchParams();
    const OrderCollectionRef = collection(FIREBASE_STORE, "orders");

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState([]);

    const pesanan = data?.ordersItem.filter(
        (order) => order.chef.uid === user.uid
    );

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

                    const url = Linking.createURL("/waiters-history-detail", {
                        queryParams: {
                            orderId: orderId,
                        },
                    });

                    // notif pelayan
                    await sendPushNotification({
                        to: data.waitersDevice,
                        sound: "default",
                        title: "Pesanan telah selesai!",
                        body: `Pesanan ${pesanan
                            .map((order) => order.name)
                            .join(", ")} untuk meja ${
                            data.table
                        } sudah siap dihidangkan!`,
                        data: {
                            url,
                        },
                    });

                    Alert.alert("Berhasil", "Pesanan berhasil dihidangkan!");
                },
            },
            {
                text: "Tidak",
                style: "cancel",
            },
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
            <View className="bg-yellow-200 rounded p-3 mb-3">
                <View className="space-y-2 mb-4">
                    <Text>Kostumer: {data?.costumer}</Text>
                    <Text>Meja: {data?.table}</Text>
                    <View className="flex-row items-center gap-2">
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

                <View className="space-y-3 border-t border-b border-zinc-400 py-3">
                    {pesanan.map((order, index) => {
                        const totalPrice = order.price * order.count;

                        return (
                            <View
                                key={index}
                                className="flex-row justify-between"
                            >
                                <Text>
                                    {order.name} x{order.count}
                                </Text>
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
            {!pesanan[0]?.served && (
                <PrimaryButton
                    label="Konfirmasi Hidangan"
                    icon="check"
                    onPress={confirmPesanan}
                />
            )}
        </AppLayout>
    );
};

export default ChefPesananDetail;
