import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import useAuth from "../../stores/useAuth";
import { router } from "expo-router";
import useNotification from "../../stores/useNotification";

export default () => {
    const { user } = useAuth();
    const { deviceToken } = useNotification();

    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        let q;

        if (user?.role === "chef") {
            q = query(
                collection(FIREBASE_STORE, "orders"),
                where("chefIds", "array-contains", user?.uid),
                orderBy("createdAt", "desc")
            );
        } else {
            q = query(
                collection(FIREBASE_STORE, "orders"),
                where("waitersDevice", "==", deviceToken || "simulator-token"),
                orderBy("createdAt", "desc")
            );
        }

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const pesanan = [];
            querySnapshot.forEach((doc) => {
                pesanan.push({ ...doc.data(), id: doc.id });
            });

            setData(pesanan);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AppLayout>
            <FlatList
                data={data}
                renderItem={(item, index) => {
                    return user?.role === "chef" ? (
                        <OrderChefItem data={item} />
                    ) : (
                        <OrderWaiterItem history={item} />
                    );
                }}
            />
        </AppLayout>
    );
};

const OrderChefItem = ({ data: { item } }) => {
    const { user } = useAuth();
    const pesanan = item.ordersItem.filter(
        (order) => order.chef.uid === user.uid
    );

    return (
        <Pressable
            className="p-3 bg-yellow-200 rounded space-y-1 mb-3"
            onPress={() => {
                router.push({
                    pathname: "/orders/detail",
                    params: {
                        orderId: item.id,
                    },
                });
            }}
        >
            <View className="mb-3">
                <Text>Meja: {item.table}</Text>
                <Text>Kostumer: {item.costumer}</Text>
            </View>
            <View
                className="flex-row items-center justify-start"
                style={{ gap: 10 }}
            >
                <Text>Status:</Text>
                {pesanan[0]?.served ? (
                    <View className="py-1 px-2 rounded-sm bg-green-400">
                        <Text className="italic text-xs">DIHIDANGKAN</Text>
                    </View>
                ) : (
                    <View className="py-1 px-2 rounded-sm bg-red-400">
                        <Text className="italic text-xs">
                            BELUM DIHIDANGKAN
                        </Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
};

const OrderWaiterItem = ({ history }) => {
    const orderCount = history?.item?.ordersItem.reduce((total, item) => {
        return item.count + total;
    }, 0);

    return (
        <Pressable
            className="p-3 bg-yellow-200 rounded mb-3"
            onPress={() => {
                router.push({
                    pathname: "/orders/detail",
                    params: {
                        orderId: history?.item?.id,
                    },
                });
            }}
        >
            <Text>Meja: {history?.item?.table}</Text>
            <Text>Kostumer: {history?.item?.costumer}</Text>
            <Text>Banyak Pesanan: {orderCount}</Text>
            <Text>Jumlah Harga: Rp {history?.item?.totalPrice}</Text>
        </Pressable>
    );
};
