import { createSlice } from "@reduxjs/toolkit"

const initialState = [];

// Creating a slice for cart-related state management
const cartSlice = createSlice ({
    name : "cart",
    initialState,
    reducers : {
        addItems : (state, action) => { // Action payload is expected to be an item object with properties like id, name, price, quantity, etc.
            state.push(action.payload);
        },

        removeItem: (state, action) => { // Action payload is expected to be the id of the item to be removed
            return state.filter(item => String(item.id) !== String(action.payload));
        },

        updateQuantity: (state, action) => { // Action payload is expected to be an object with properties: id (item id) and type ('increment' or 'decrement')
            const { id, type } = action.payload;
            const existingItem = state.find(item => item.id === id);

            if (existingItem) { // If the item exists in the cart, update its quantity and price based on the type of update
              if (type === 'increment') {
                existingItem.quantity += 1;
                existingItem.price = existingItem.pricePerQuantity * existingItem.quantity;
              }
            }
        },

        clearCart: (state) => {
            return initialState; // Returns an empty array [] to reset the cart state completely
        }
    }
})

export const getTotalPrice = (state) => state.cart.reduce((total, item) => total + item.price, 0); // Selector to calculate the total price of items in the cart by summing up the price of each item
export const { addItems, removeItem, updateQuantity, clearCart } = cartSlice.actions; // Exporting the action creators for adding items, removing items, and updating item quantity in the cart
export default cartSlice.reducer; // Exporting the reducer to be used in the Redux store