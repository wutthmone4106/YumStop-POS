import { createSlice } from '@reduxjs/toolkit';

// Initial state for the customer slice
const initialState = {
    orderId : "",
    customerName: "",
    customerPhone: "",
    guests: 0,
    tableNo: "",
    tableId: null,
    orderType: "Dine In" // Tracks if current order flow is "Dine In" or "Take Away"
};

// Creating a slice for customer-related state management
const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: { 
        setCustomer: (state, action) => {
            const { name, phone, guests, orderType } = action.payload;
            state.orderId = `${Date.now()}`;
            state.customerName = name;
            state.customerPhone = phone || "";
            state.guests = guests || 0;
            state.orderType = orderType || "Dine In";
        },

        removeCustomer: (state) => {
            state.orderId = "";
            state.customerName = "";
            state.customerPhone = "";
            state.guests = 0;
            state.tableNo = "";
            state.tableId = null;
            state.orderType = "Dine In";
        },

        updateTable: (state, action) => {
            state.tableNo = action.payload.tableNo;
            state.tableId = action.payload.tableId;
        }
    }
});

export const { setCustomer, removeCustomer, updateTable } = customerSlice.actions; // Exporting the action creators for setting customer data, removing customer data, and updating table number
export default customerSlice.reducer; // Exporting the reducer to be used in the Redux store
