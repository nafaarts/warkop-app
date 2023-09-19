import { View, Text, Alert, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import AppLayout from "../../components/layouts/AppLayout";
import { router } from "expo-router";
import SmallButton from "../../components/button/SmallButton";
import { deleteUser, getUsers } from "../../services/user";

const UserIndex = () => {
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const getData = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            setUsers(
                response.users.filter(
                    (user) => user.customClaims.account_level !== "admin"
                )
            );
            setLoading(false);
        } catch (error) {
            Alert.alert("Error", error?.message);
            setLoading(false);
        }
    };

    const handleDelete = (uid) => {
        Alert.alert("Konfirmasi", "Apakah anda yakin dihapus?", [
            {
                text: "Ya",
                style: "default",
                onPress: async () => {
                    const response = await deleteUser(uid);
                    if (response) {
                        getData();
                    }
                },
            },
            {
                text: "Tidak",
                style: "cancel",
            },
        ]);
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
            <View style={{ flex: 1 }}>
                <FlatList
                    data={users}
                    renderItem={(user) => (
                        <UserCard user={user} handleDelete={handleDelete} />
                    )}
                    keyExtractor={(user, index) => index.toString()}
                />
            </View>
        </AppLayout>
    );
};

const UserCard = ({ user, handleDelete }) => {
    return (
        <View className="p-3 bg-yellow-200 rounded mb-3">
            <View className="flex-row justify-between items-start">
                <View>
                    <Text className="font-medium mb-2">
                        {user?.item?.displayName}
                    </Text>
                    <Text className="text-xs mb-2 italic">
                        {user?.item?.customClaims.account_level}
                    </Text>
                    <Text className="text-xs">{user?.item?.email}</Text>
                </View>
                <View className="flex-row gap-2">
                    <SmallButton
                        icon="edit"
                        className="bg-yellow-500"
                        onPress={() => {
                            router.push({
                                pathname: "/user-edit",
                                params: {
                                    userUid: user?.item?.uid,
                                    userName: user?.item?.displayName,
                                    userEmail: user?.item?.email,
                                    userRole:
                                        user?.item?.customClaims.account_level,
                                },
                            });
                        }}
                    />
                    <SmallButton
                        icon="trash"
                        className="bg-red-700"
                        onPress={() => handleDelete(user?.item?.uid)}
                    />
                </View>
            </View>
        </View>
    );
};

export default UserIndex;
