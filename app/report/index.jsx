import { View, Text, ActivityIndicator, Modal, Button } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import Select from "../../components/form/Select";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import CalendarPicker from "react-native-calendar-picker";
import PrimaryButton from "../../components/button/PrimaryButton";

const OrderCollectionRef = collection(FIREBASE_STORE, "orders");

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
        { label: "Kustom Periode", value: "custom_period" },
    ]);

    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState([]);

    const [showModal, setShowModal] = React.useState(false);
    const [calendarCustomPeriod, setCalendarCustomPeriod] = React.useState({
        START_DATE: "",
        END_DATE: "",
    });

    const getData = async (startDate, endDate) => {
        setLoading(true);

        let q = query(
            OrderCollectionRef,
            where("customCreatedAt", ">=", startDate),
            orderBy("customCreatedAt", "desc")
        );

        if (endDate) {
            q = query(
                OrderCollectionRef,
                where("customCreatedAt", ">=", startDate),
                where("customCreatedAt", "<=", endDate),
                orderBy("customCreatedAt", "desc")
            );
        }

        const result = await getDocs(q);
        setData(result.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        setLoading(false);
    };

    const totalRevenue = data
        .filter((item) => item.paidStatus)
        .reduce((total, item) => {
            return item.totalPrice + total;
        }, 0);

    React.useEffect(() => {
        const filter = filterPeriod(value);
        if (value === "custom_period" && calendarCustomPeriod.END_DATE !== "") {
            getData(
                new Date(calendarCustomPeriod.START_DATE),
                new Date(calendarCustomPeriod.END_DATE)
            );
        } else {
            getData(filter.startDate);
        }
    }, [value, calendarCustomPeriod.END_DATE]);

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
        <>
            <AppLayout>
                <View className="p-3 bg-yellow-100 rounded mb-3">
                    <View>
                        <Text className="mb-1">Keuntungan</Text>
                        <Text className="font-bold text-2xl">
                            Rp {totalRevenue}
                        </Text>
                    </View>
                </View>

                <View className="mb-3">
                    <Select
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        placeholder="Pilih periode"
                    />
                    {value === "custom_period" && (
                        <PrimaryButton
                            label={
                                calendarCustomPeriod.END_DATE !== ""
                                    ? `${convertDate(
                                          calendarCustomPeriod.START_DATE
                                      )} sampai ${convertDate(
                                          calendarCustomPeriod.END_DATE
                                      )}`
                                    : "Pilih Tanggal"
                            }
                            icon="calendar"
                            onPress={() => setShowModal(true)}
                        />
                    )}
                </View>
            </AppLayout>
            <Modal
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
                animationType="slide"
            >
                <AppLayout>
                    <View className="bg-yellow-200 rounded-md">
                        <CalendarPicker
                            allowRangeSelection={true}
                            onDateChange={(date, type) => {
                                setCalendarCustomPeriod((prev) => ({
                                    ...prev,
                                    [type]: date,
                                }));

                                if (type === "END_DATE") {
                                    setShowModal(false);
                                }
                            }}
                        />
                    </View>
                </AppLayout>
            </Modal>
        </>
    );
};

const filterPeriod = (value) => {
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

        case "today":
            startDate = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
            );
            break;

        default:
            startDate = null;
            break;
    }

    return {
        type: value,
        startDate,
    };
};

const convertDate = (from) => {
    const date = new Date(from);
    return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
};
