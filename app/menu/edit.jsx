import React from "react";
import {
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import AppLayout from "../../components/layouts/AppLayout";
import TextInput from "../../components/form/TextInput";
import Select from "../../components/form/Select";
import PrimaryButton from "../../components/button/PrimaryButton";
import ImageInput from "../../components/form/ImageInput";

import { getMenuById, updateMenu } from "../../services/menu";
import { getUsers } from "../../services/user";

export default () => {
    const { menuId } = useLocalSearchParams();

    const [menu, setMenu] = React.useState({});

    // form field
    const [name, setName] = React.useState({ value: "", error: "" });
    const [price, setPrice] = React.useState({ value: "", error: "" });
    const [description, setDescription] = React.useState({
        value: "",
        error: "",
    });

    // category picker
    const [category, setCategory] = React.useState("");
    const [categoryError, setCategoryError] = React.useState("");
    const [categoryOpen, setCategoryOpen] = React.useState(false);
    const [categories, setCategories] = React.useState([
        { label: "Makanan", value: "makanan" },
        { label: "Minuman", value: "minuman" },
    ]);

    // chef picker
    const [chef, setChef] = React.useState({});
    const [chefError, setChefError] = React.useState("");
    const [chefOpen, setChefOpen] = React.useState(false);
    const [chefs, setChefs] = React.useState([]);

    // image field
    const [image, setImage] = React.useState({ value: "", error: "" });

    const [loading, setLoading] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);

    const onCheftOpen = React.useCallback(() => {
        setCategoryOpen(false);
    }, []);

    const onCategoryOpen = React.useCallback(() => {
        setChefOpen(false);
    }, []);

    const getMenu = async () => {
        const data = await getMenuById(menuId);
        setMenu(data.data());

        setName({ value: data.data()?.name });
        setPrice({ value: `${data.data()?.price}` });
        setDescription({ value: data.data()?.description });
        setCategory(data.data()?.category);
        setChef(data.data()?.chef);
    };

    const getChef = async () => {
        try {
            setLoading(true);
            const response = await getUsers();
            setChefs(
                response.users
                    .filter(
                        (user) => user.customClaims.account_level === "chef"
                    )
                    .map((user) => ({
                        label: user.displayName,
                        value: {
                            uid: user.uid,
                            name: user.displayName,
                        },
                    }))
            );
            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error?.message);
            setLoading(false);
        }
    };

    const handleUpdateMenu = async () => {
        console.log(name.value, price.value, description.value, category, chef);

        if (
            !name.value ||
            !price.value ||
            !description.value ||
            !category ||
            !chef
        ) {
            if (!name.value) {
                setName({ error: "Nama menu harus diisi!" });
            }
            if (!price.value) {
                setPrice({ error: "Harga harus diisi!" });
            }
            if (!description.value) {
                setDescription({ error: "Deskripsi harus diisi!" });
            }
            if (!chef) {
                setChefError("Silahkan pilih chef!");
            }
            if (!category) {
                setCategoryError("Silahkan pilih kategori!");
            }

            return;
        }

        const dataUpdate = {
            name: name.value,
            category,
            price: parseInt(price.value),
            description: description.value,
            chef,
        };

        let imageUpdate = null;
        if (image?.value) {
            imageUpdate = {
                uri: image?.value?.assets[0]?.uri || null,
                path: "menu/",
            };
        }

        try {
            await updateMenu(menuId, dataUpdate, imageUpdate, (v) =>
                setIsUploading(v !== 100)
            );

            Alert.alert("berhasil", "Menu berhasil diubah!");
            router.replace("/menu");
        } catch (e) {
            console.log(e.message);
            Alert.alert("Error Uploading Image " + e.message);
        }
    };

    React.useEffect(() => {
        getChef();
        getMenu();
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
            <KeyboardAvoidingView behavior="height">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
                    <View className="mb-3">
                        <TextInput
                            label="Nama Menu"
                            placeholder="Masukan nama menu"
                            value={name.value}
                            error={name.error}
                            onChangeText={(value) => setName({ value })}
                        />

                        <Select
                            label="Kategori"
                            open={categoryOpen}
                            value={category}
                            items={categories}
                            setOpen={setCategoryOpen}
                            onOpen={onCategoryOpen}
                            setValue={(value) => {
                                setCategory(value);
                                setCategoryError("");
                            }}
                            setItems={setCategories}
                            error={categoryError}
                        />

                        <TextInput
                            label="Harga"
                            placeholder="Masukan harga"
                            keyboardType="numeric"
                            value={price.value}
                            error={price.error}
                            onChangeText={(value) => setPrice({ value })}
                        />

                        <Select
                            label="Chef"
                            open={chefOpen}
                            value={chef}
                            items={chefs}
                            setOpen={setChefOpen}
                            onOpen={onCheftOpen}
                            setValue={(value) => {
                                setChef(value);
                                setChefError("");
                            }}
                            setItems={setCategories}
                            error={chefError}
                        />

                        <TextInput
                            label="Deskripsi"
                            placeholder="Masukan deskripsi"
                            value={description.value}
                            error={description.error}
                            onChangeText={(value) => setDescription({ value })}
                        />

                        <ImageInput
                            label="Pilih Gambar"
                            onPick={(pickedImage) => {
                                setImage({ value: pickedImage });
                            }}
                            imgSource={{
                                uri: menu?.image?.url,
                            }}
                            error={image.error}
                            loading={isUploading}
                        />
                    </View>
                    <PrimaryButton label="SIMPAN" onPress={handleUpdateMenu} />
                </ScrollView>
            </KeyboardAvoidingView>
        </AppLayout>
    );
};
