import { View, Text, FlatList, Pressable } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import {
    collection,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    where,
} from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import useAuth from "../../stores/useAuth";
import { router } from "expo-router";

const ChefPesanan = () => {
    const { user } = useAuth();
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        const q = query(
            collection(FIREBASE_STORE, "orders"),
            where("chefIds", "array-contains", user?.uid),
            orderBy("createdAt", "desc")
        );
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
                renderItem={(item, index) => <PesananItem item={item} />}
            />
        </AppLayout>
    );
};

const PesananItem = ({ item: { item } }) => {
    const { user } = useAuth();
    const pesanan = item.ordersItem.filter(
        (order) => order.chef.uid === user.uid
    );

    return (
        <Pressable
            className="p-3 bg-yellow-200 rounded space-y-1 mb-3"
            onPress={() => {
                router.push({
                    pathname: "/chef-pesanan-detail",
                    params: {
                        orderId: item.id,
                    },
                });
            }}
        >
            <Text>Meja: {item.table}</Text>
            <Text>Kostumer: {item.costumer}</Text>
            <Text>
                Status:{" "}
                {pesanan[0]?.served ? "DIHIDANGKAN" : "BELUM DIHIDANGKAN"}
            </Text>
        </Pressable>
    );
};

export default ChefPesanan;
