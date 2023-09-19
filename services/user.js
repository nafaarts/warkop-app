import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://radjakuphie.deply.site/api",
});

const getUsers = async () => {
    const request = await axiosInstance.get("/users");
    return request.data;
};

const deleteUser = async (id) => {
    const request = await axiosInstance.delete("/user/" + id);
    return request;
};

const editUser = async (data) => {
    const request = await axiosInstance.patch("/user", data);
    return request;
};

const createUser = async (data) => {
    const request = await axiosInstance.post("/user", data);
    return request;
};

export { getUsers, deleteUser, editUser, createUser };
