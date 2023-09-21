import React from "react";
import {
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    ScrollView,
    Alert,
} from "react-native";
import { router } from "expo-router";

import AppLayout from "../../components/layouts/AppLayout";
import TextInput from "../../components/form/TextInput";
import Select from "../../components/form/Select";
import PrimaryButton from "../../components/button/PrimaryButton";
import ImageInput from "../../components/form/ImageInput";

import { createMenu } from "../../services/menu";
import { getUsers } from "../../services/user";

export default () => {
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

    const handleCreateMenu = async () => {
        if (
            !name.value ||
            !price.value ||
            !description.value ||
            !category ||
            !chef ||
            !image.value
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
            if (!image.value) {
                setImage({ error: "Silahkan masukan gambar!" });
            }
            if (!chef) {
                setChefError("Silahkan pilih chef!");
            }
            if (!category) {
                setCategoryError("Silahkan pilih kategori!");
            }

            return;
        }

        try {
            await createMenu(
                {
                    name: name.value,
                    category,
                    price: parseInt(price.value),
                    description: description.value,
                    chef,
                },
                {
                    uri: image.value.assets[0].uri,
                    path: "menu/",
                },
                (v) => setIsUploading(v !== 100)
            );

            Alert.alert("berhasil", "Menu berhasil ditambahkan!");
            router.replace("/menu");
        } catch (e) {
            Alert.alert("Error Uploading Image " + e.message);
        }
    };

    React.useEffect(() => {
        getChef();
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
                            error={description.error}
                            onChangeText={(value) => setDescription({ value })}
                        />

                        <ImageInput
                            label="Pilih Gambar"
                            onPick={(pickedImage) => {
                                setImage({ value: pickedImage });
                            }}
                            error={image.error}
                            loading={isUploading}
                        />
                    </View>
                    <PrimaryButton label="SIMPAN" onPress={handleCreateMenu} />
                </ScrollView>
            </KeyboardAvoidingView>
        </AppLayout>
    );
};
