import { View, Text, FlatList, ImageBackground, Alert } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import SmallButton from "../../components/button/SmallButton";
import useAuth from "../../stores/useAuth";
import TextInput from "../../components/form/TextInput";
import { router } from "expo-router";

const menuCollectionRef = collection(FIREBASE_STORE, "menu");

export default () => {
    const { user } = useAuth();

    const [menus, setMenus] = React.useState([]);
    const [search, setSearch] = React.useState("");

    const filteredMenu = () => {
        return menus.filter((item) =>
            item.name.toLowerCase().includes(search.toLocaleLowerCase())
        );
    };

    const getData = async () => {
        let q = query(menuCollectionRef);

        if (user?.role === "chef") {
            q = query(menuCollectionRef, where("chef.uid", "==", user?.uid));
        }

        const data = await getDocs(q);

        setMenus(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    const handleDelete = (id) => {
        Alert.alert("Konfirmasi", "Apakah anda yakin hapus menu ini?", [
            {
                text: "Ya",
                style: "default",
                onPress: async () => {
                    try {
                        await deleteDoc(doc(FIREBASE_STORE, "menu", id));
                        await getData();

                        Alert.alert("Berhasil", "Menu berhasil dihapus!");
                    } catch (error) {
                        Alert.alert("Terjadi kesalahan", error.message);
                    }
                },
            },
            { text: "Tidak", style: "cancel" },
        ]);
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <AppLayout>
            <TextInput
                placeholder="Cari nama menu"
                onChangeText={(value) => setSearch(value)}
            />
            <FlatList
                data={filteredMenu()}
                renderItem={(menu) => (
                    <MenuCard menu={menu} handleDelete={handleDelete} />
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 10 }}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </AppLayout>
    );
};

const MenuCard = ({ menu, handleDelete }) => {
    const { user } = useAuth();

    return (
        <View className="flex-1 p-3 bg-yellow-200 rounded">
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

                        {user?.role !== "chef" && (
                            <View className="flex-row" style={{ gap: 5 }}>
                                <SmallButton
                                    icon="edit"
                                    onPress={() =>
                                        router.push({
                                            pathname: "/menu/edit",
                                            params: {
                                                menuId: menu.item.id,
                                            },
                                        })
                                    }
                                    className="bg-yellow-500"
                                />
                                <SmallButton
                                    icon="trash"
                                    onPress={() => handleDelete(menu.item.id)}
                                    className="bg-red-700"
                                />
                            </View>
                        )}
                    </View>
                </ImageBackground>
            </View>
            <Text className="text-xs italic">
                {menu.item?.chef?.name || "nama chef"}
            </Text>
            <Text className="font-bold text-lg mb-1">{menu.item.name}</Text>
            <Text className="font-medium">Rp {menu.item.price}</Text>
        </View>
    );
};
