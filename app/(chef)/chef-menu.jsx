import {
    View,
    Text,
    FlatList,
    ImageBackground,
    Dimensions,
} from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_STORE } from "../../firebase/firebase";
import useAuth from "../../stores/useAuth";

const menuCollectionRef = collection(FIREBASE_STORE, "menu");

const ChefMenu = () => {
    const { user } = useAuth();
    const [menus, setMenus] = React.useState([]);

    const getData = async () => {
        const data = await getDocs(
            query(menuCollectionRef, where("chef.uid", "==", user.uid))
        );
        setMenus(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    React.useEffect(() => {
        getData();
    }, []);

    return (
        <AppLayout>
            <FlatList
                data={menus}
                renderItem={(menu) => <MenuCard menu={menu} />}
                keyExtractor={(item, index) => index.toString()}
                numColumns={2}
                columnWrapperStyle={{ gap: 10 }}
                contentContainerStyle={{ gap: 10 }}
                showsVerticalScrollIndicator={false}
            />
        </AppLayout>
    );
};

const MenuCard = ({ menu }) => {
    return (
        <View className="p-3 bg-yellow-200 rounded flex-1">
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
            <Text className="text-xs italic">
                {menu.item?.chef?.name || "nama chef"}
            </Text>
            <Text className="font-bold text-lg mb-1">{menu.item.name}</Text>
            <Text className="font-medium">Rp {menu.item.price}</Text>
        </View>
    );
};

export default ChefMenu;
