import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import Select from "../../components/form/Select";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";

export default () => {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("today");
    const [items, setItems] = React.useState([
        { label: "Hari Ini", value: "today" },
        { label: "minggu ini", value: "this_week" },
        { label: "bulan ini", value: "this_month" },
        { label: "3 bulan terakhir", value: "last_3_months" },
        { label: "6 bulan terkahir", value: "last_6_months" },
        { label: "1 tahun terakhir", value: "last_year" },
    ]);

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState([]);

    const OrderCollectionRef = collection(FIREBASE_STORE, "orders");

    const getData = async () => {
        setLoading(true);
        const currentDate = new Date();

        let startDate = null;

        switch (value) {
            case "this_week":
                startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate() - currentDate.getDay()
                );
                break;

            case "this_month":
                startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    1
                );
                break;

            case "last_3_months":
                startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 2,
                    1
                );
                break;

            case "last_6_months":
                startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth() - 5,
                    1
                );
                break;

            case "last_year":
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                break;

            default:
                startDate = new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    currentDate.getDate()
                );
                break;
        }

        const result = await getDocs(
            query(
                OrderCollectionRef,
                where("customCreatedAt", ">=", startDate),
                orderBy("customCreatedAt", "desc")
            )
        );
        setData(result.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        setLoading(false);
    };

    const totalRevenue = data
        .filter((item) => item.paidStatus)
        .reduce((total, item) => {
            return item.totalPrice + total;
        }, 0);

    React.useEffect(() => {
        getData();
    }, [value]);

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
            <View className="p-3 bg-yellow-100 rounded mb-3">
                <View>
                    <Text className="mb-1">Keuntungan</Text>
                    <Text className="font-bold text-2xl">
                        Rp {totalRevenue}
                    </Text>
                </View>
            </View>
            <Select
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Pilih periode"
            />
        </AppLayout>
    );
};
