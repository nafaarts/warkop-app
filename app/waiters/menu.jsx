import {
    View,
    Text,
    FlatList,
    ImageBackground,
    Modal,
    Pressable,
    Image,
    ScrollView,
    Alert,
} from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import PrimaryButton from "../../components/button/PrimaryButton";
import SecondaryButton from "../../components/button/SecondaryButton";
import useCart from "../../stores/userCart";
import { router } from "expo-router";

const menuCollectionRef = collection(FIREBASE_STORE, "menu");

export default () => {
    const { addOrder } = useCart();

    const [menus, setMenus] = React.useState([]);
    const [selectedMenu, setSelectedMenu] = React.useState({});
    const [showModal, setShowModal] = React.useState(false);

    const getData = async () => {
        const data = await getDocs(menuCollectionRef);
        setMenus(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const handleAddOrder = () => {
        const newOrder = {
            ...selectedMenu,
            count: 1,
        };

        addOrder(newOrder);

        Alert.alert("Berhasil", "Menu berhasil ditambah!");

        router.replace("/waiters/cart");
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <>
            <AppLayout>
                <FlatList
                    data={menus}
                    renderItem={(menu) => (
                        <MenuCard
                            menu={menu}
                            onPress={() => {
                                setSelectedMenu(menu.item);
                                setShowModal(true);
                            }}
                        />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    numColumns={2}
                    columnWrapperStyle={{ gap: 10 }}
                    contentContainerStyle={{ gap: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            </AppLayout>
            <Modal
                visible={showModal}
                animationType="slide"
                onRequestClose={() => {
                    setShowModal(false);
                }}
            >
                <AppLayout>
                    <View className="flex-1 py-3">
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="overflow-hidden rounded-md mb-4">
                                <Image
                                    source={{
                                        uri: selectedMenu?.image?.url,
                                    }}
                                    style={{
                                        width: "100%",
                                        aspectRatio: 1,
                                    }}
                                />
                            </View>

                            <View className="border-b border-white pb-4 mb-4">
                                <View className="flex-row items-center justify-between">
                                    <View className="py-1 px-3 rounded bg-yellow-300 mb-3">
                                        <Text className="text-xs">
                                            {selectedMenu?.category}
                                        </Text>
                                    </View>
                                    <Text className="text-white text-xl">
                                        Rp {selectedMenu?.price}
                                    </Text>
                                </View>

                                <Text className="text-white text-2xl">
                                    {selectedMenu?.name}
                                </Text>
                            </View>

                            <Text className="text-white mb-3 text-xs">
                                {selectedMenu?.chef?.name}
                            </Text>

                            <Text className="text-xs text-white">
                                {selectedMenu?.description}
                            </Text>
                        </ScrollView>
                    </View>
                    <View style={{ gap: 10 }}>
                        <PrimaryButton
                            icon="plus"
                            label="Tambah Pesanan"
                            onPress={handleAddOrder}
                        />
                        <SecondaryButton
                            icon="arrow-left"
                            label="Batal"
                            onPress={() => {
                                setShowModal(false);
                            }}
                        />
                    </View>
                </AppLayout>
            </Modal>
        </>
    );
};

const MenuCard = ({ menu, onPress }) => {
    return (
        <Pressable
            className="p-3 bg-yellow-200 rounded flex-1"
            onPress={onPress}
        >
            <View className="overflow-hidden rounded mb-3">
                <ImageBackground
                    source={{
                        uri: menu.item.image.url,
                    }}
                    style={{ width: "100%", aspectRatio: 1 }}
                >
                    <View className="flex-row gap-2 justify-between items-start">
                        <View className="p-1 rounded bg-yellow-400">
                            <Text className="text-xs font-medium">
                                {menu.item.category}
                            </Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <Text className="font-bold text-lg mb-1">{menu.item.name}</Text>
            <Text className="font-medium">Rp {menu.item.price}</Text>
        </Pressable>
    );
};
