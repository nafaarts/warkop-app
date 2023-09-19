import { View, Text, ScrollView, Image, Alert } from "react-native";
import React from "react";
import useCart from "../../stores/userCart";
import AppLayout from "../../components/layouts/AppLayout";
import PrimaryButton from "../../components/button/PrimaryButton";
import SecondaryButton from "../../components/button/SecondaryButton";
import { router } from "expo-router";
import SmallButton from "../../components/button/SmallButton";
import useNotification, {
    sendPushNotification,
} from "../../stores/useNotification";
import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import * as Linking from "expo-linking";

const WaitersCart = () => {
    const { costumer, table, orders } = useCart();
    const { deviceToken } = useNotification();
    const [loading, setLoading] = React.useState(false);

    const totalPrice = orders.reduce((total, item) => {
        return item.price * item.count + total;
    }, 0);

    const handleCreateOrder = () => {
        const createOrderData = {
            costumer,
            table,
            chefIds: orders.map((order) => order.chef.uid),
            waitersDevice: deviceToken,
            paidStatus: false,
            totalPrice,
            ordersItem: orders,
            createdAt: serverTimestamp(),
            customCreatedAt: new Date(),
        };

        Alert.alert("Konfirmasi", "Buat pesanan?", [
            {
                text: "Ya",
                style: "default",
                onPress: async () => {
                    setLoading(true);
                    const newOrderCreated = await addDoc(
                        collection(FIREBASE_STORE, "orders"),
                        createOrderData
                    );

                    createOrderData.ordersItem.forEach(async (order) => {
                        const tokens = await getDoc(
                            doc(FIREBASE_STORE, "devices", order.chef.uid)
                        );

                        tokens.data()?.deviceToken.forEach(async (token) => {
                            const url = Linking.createURL(
                                "/chef-pesanan-detail",
                                {
                                    queryParams: {
                                        orderId: newOrderCreated.id,
                                    },
                                }
                            );

                            const notifData = {
                                to: token,
                                sound: "default",
                                title: "Pesanan Baru!",
                                body: `Meja ${createOrderData.table} memesan ${order.count} ${order.name}.`,
                                data: {
                                    url,
                                },
                            };

                            await sendPushNotification(notifData);
                        });
                    });

                    if (newOrderCreated) {
                        Alert.alert("Berhasil", "Pesanan berhasil dibuat!");
                        router.replace("/");
                    }

                    setLoading(false);
                },
            },
            {
                text: "Tidak",
                style: "cancel",
            },
        ]);

        // console.log(JSON.stringify(createOrderData, null, 2));
    };

    return (
        <AppLayout>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 160,
                }}
            >
                {orders.length > 0 ? (
                    orders.map((order, i) => (
                        <OrderItem key={i} index={i} order={order} />
                    ))
                ) : (
                    <View className="p-4 border border-white rounded mb-3">
                        <Text className="text-center text-white">
                            Belum ada pesanan
                        </Text>
                    </View>
                )}

                <SecondaryButton
                    icon="plus"
                    label="Tambah Menu"
                    onPress={() => {
                        router.push("/waiters-menu");
                    }}
                />
            </ScrollView>

            <View className="absolute inset-x-0 bottom-0 p-6 bg-yellow-500 overflow-hidden rounded-t-2xl">
                <View className="flex-row justify-between pb-4 mb-4 border-b border-gray-400">
                    <Text>Kostumer: {costumer}</Text>
                    <Text>Meja: {table}</Text>
                </View>
                <View className="flex-row justify-between items-center">
                    <View>
                        <Text className="mb-1">Total</Text>
                        <Text className="font-bold text-2xl">
                            Rp {totalPrice}
                        </Text>
                    </View>
                    <PrimaryButton
                        label="Buat Pesanan"
                        className="bg-white"
                        onPress={handleCreateOrder}
                        loading={loading}
                    />
                </View>
            </View>
        </AppLayout>
    );
};

const OrderItem = ({ order, index }) => {
    const { orders, setOrders } = useCart();
    const [count, setCount] = React.useState(order.count || 1);

    const handleDelete = () => {
        orders.splice(index, 1);
        setOrders(orders);
    };

    React.useEffect(() => {
        orders[index].count = count;
        setOrders(orders);
    }, [count]);

    return (
        <View className="mb-3 flex-row bg-yellow-200 rounded-md items-start">
            <View className="flex-1 flex-row gap-3">
                <View className="overflow-hidden rounded-md">
                    <Image
                        source={{
                            uri: order.image.url,
                        }}
                        style={{
                            height: 100,
                            aspectRatio: 1,
                        }}
                    />
                </View>
                <View className="items-start py-3">
                    <Text className="mb-1 font-bold">{order.name}</Text>
                    <Text className="mb-2">Rp {order.price}</Text>
                    <View className="flex-row items-center border-yellow-500 rounded">
                        <SmallButton
                            icon="minus"
                            className="bg-yellow-500 p-1"
                            disabled={count === 1}
                            onPress={() => {
                                setCount((value) => value - 1);
                            }}
                        />
                        <View className="py-1 px-2 bg-white">
                            <Text className="text-xs">{count}</Text>
                        </View>
                        <SmallButton
                            icon="plus"
                            className="bg-yellow-500 p-1"
                            onPress={() => {
                                setCount((value) => value + 1);
                            }}
                        />
                    </View>
                </View>
            </View>
            <SmallButton
                icon="trash"
                className="bg-red-500 m-2"
                onPress={handleDelete}
            />
        </View>
    );
};

export default WaitersCart;
