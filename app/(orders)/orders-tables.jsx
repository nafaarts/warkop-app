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
import { router } from "expo-router";

const OrdersTables = () => {
    const [table, setTable] = React.useState(0);
    const [loading, setLoading] = React.useState(false);

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

    React.useEffect(() => {
        getConfiguration();
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
                <TouchableOpacity
                    className="w-1/3 p-1"
                    onPress={() => {
                        router.push({
                            pathname: "/orders-index",
                            params: {
                                table: 0,
                            },
                        });
                    }}
                >
                    <View className="bg-yellow-300 py-5 rounded">
                        <Text className="font-bold text-center text-lg">
                            Semua
                        </Text>
                    </View>
                </TouchableOpacity>

                {[...Array(table)].map((x, i) => {
                    return (
                        <TouchableOpacity
                            key={i}
                            className="w-1/3 p-1"
                            onPress={() => {
                                router.push({
                                    pathname: "/orders-index",
                                    params: {
                                        table: i + 1,
                                    },
                                });
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
        </AppLayout>
    );
};

export default OrdersTables;
