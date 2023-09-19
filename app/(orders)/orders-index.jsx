import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import { router, useLocalSearchParams } from "expo-router";

const OrdersIndex = () => {
    const { table } = useLocalSearchParams();

    const OrderCollectionRef = collection(FIREBASE_STORE, "orders");
    const [orders, setOrders] = React.useState([]);

    React.useEffect(() => {
        const unsubscribe = onSnapshot(
            query(OrderCollectionRef, orderBy("createdAt")),
            (querySnapshot) => {
                const pesanan = [];
                querySnapshot.forEach((doc) => {
                    pesanan.push({ ...doc.data(), id: doc.id });
                });

                setOrders(
                    table == 0
                        ? pesanan
                        : pesanan.filter((item) => item.table == table)
                );
            }
        );

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AppLayout>
            <FlatList
                data={orders}
                renderItem={(order) => <OrderCard order={order} />}
            />
        </AppLayout>
    );
};

const OrderCard = ({ order }) => {
    const orderCount = order?.item?.ordersItem.reduce((total, item) => {
        return item.count + total;
    }, 0);

    return (
        <Pressable
            className="flex-row justify-between items-start p-3 bg-yellow-200 rounded mb-3"
            onPress={() => {
                router.push({
                    pathname: "/orders-detail",
                    params: {
                        orderId: order?.item?.id,
                    },
                });
            }}
        >
            <View className="space-y-2">
                <Text>Meja: {order?.item?.table}</Text>
                <Text>Kostumer: {order?.item?.costumer}</Text>
                <Text>
                    Jumlah Harga: Rp {order?.item?.totalPrice} ({orderCount})
                </Text>
            </View>

            {order?.item?.paidStatus ? (
                <View className="py-1 px-2 rounded-sm bg-green-400">
                    <Text className="italic text-xs">DIBAYAR</Text>
                </View>
            ) : (
                <View className="py-1 px-2 rounded-sm bg-red-400">
                    <Text className="italic text-xs">BELUM DIBAYAR</Text>
                </View>
            )}
        </Pressable>
    );
};

export default OrdersIndex;
