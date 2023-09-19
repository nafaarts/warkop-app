import {
    View,
    Text,
    FlatList,
    Pressable,
    ActivityIndicator,
} from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import useNotification from "../../stores/useNotification";
import { router } from "expo-router";

const WaitersHistory = () => {
    const OrderCollectionRef = collection(FIREBASE_STORE, "orders");
    const { deviceToken } = useNotification();

    const [histories, setHistories] = React.useState([]);
    const [loading, setLoading] = React.useState([]);

    const getData = async () => {
        setLoading(true);
        const data = await getDocs(
            query(
                OrderCollectionRef,
                where("waitersDevice", "==", deviceToken),
                orderBy("createdAt", "desc")
            )
        );

        setHistories(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
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
            <FlatList
                data={histories}
                renderItem={(history) => <HistoryCard history={history} />}
            />
        </AppLayout>
    );
};

const HistoryCard = ({ history }) => {
    const orderCount = history?.item?.ordersItem.reduce((total, item) => {
        return item.count + total;
    }, 0);

    return (
        <Pressable
            className="p-3 bg-yellow-200 rounded mb-3"
            onPress={() => {
                router.push({
                    pathname: "/waiters-history-detail",
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

export default WaitersHistory;
