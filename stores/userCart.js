import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const handleAddOrder = (set, newOrder) => {
    set((state) => {
        if (state.orders.some((order) => order.id === newOrder.id)) {
            const index = state.orders.findIndex(
                (order) => order.id === newOrder.id
            );
            state.orders[index].count += 1;

            return { orders: state.orders };
        } else {
            return {
                orders: [...state.orders, newOrder],
            };
        }
    });
};

const useCart = create(
    persist(
        (set) => ({
            costumer: null,
            table: null,
            orders: [],
            setCostumer: ({ costumer, table }) => set({ costumer, table }),
            setOrders: (orders) => set({ orders }),
            addOrder: (newOrder) => handleAddOrder(set, newOrder),
            resetCart: () => set({ costumer: null, table: null, orders: [] }),
        }),
        {
            name: "auth-data",
            storage: createJSONStorage(() => ReactNativeAsyncStorage),
        }
    )
);

export default useCart;
