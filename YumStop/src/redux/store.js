import { configureStore } from "@reduxjs/toolkit";
import customerSlice from "./slices/customerSlice";
import cartSlice from "./slices/cartSlice";
import userSlice from "./slices/userSlice";
import searchSlice from "./slices/searchSlice";

const store = configureStore({
    reducer: {
        customer: customerSlice,
        cart: cartSlice,
        user: userSlice,
        search: searchSlice
    },

    devTools: import.meta.env.NODE_ENV !== "production", // To see data in redux store
});

export default store;
