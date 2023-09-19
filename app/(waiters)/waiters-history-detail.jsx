import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import AppLayout from "../../components/layouts/AppLayout";
import { collection, doc, getDoc } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";

const WaitersHistoryDetail = () => {
    const { orderId } = useLocalSearchParams();
    const OrderCollectionRef = collection(FIREBASE_STORE, "orders");

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState([]);

    const getData = async () => {
        setLoading(true);
        const data = await getDoc(doc(OrderCollectionRef, orderId));
        setData(data.data());
        setLoading(false);
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
            <View className="bg-yellow-200 rounded p-3">
                <View className="space-y-2 mb-4">
                    <Text>Kostumer: {data?.costumer}</Text>
                    <Text>Meja: {data?.table}</Text>
                    <View className="flex-row items-center gap-2">
                        <Text>Status Bayar:</Text>

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

                <View className="space-y-3 border-t border-b border-zinc-400 py-3">
                    {data.ordersItem.map((order, index) => {
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
                    <Text className="font-bold text-lg">
                        Rp {data.totalPrice}
                    </Text>
                </View>
            </View>
        </AppLayout>
    );
};

export default WaitersHistoryDetail;
