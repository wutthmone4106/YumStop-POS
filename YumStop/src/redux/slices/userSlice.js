import { createSlice } from '@reduxjs/toolkit';

// Initial state for the user slice
const initialState = {
    _id: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    isAuth: false // Flag to indicate if the user is authenticated
}

// Creating a slice for user-related state management
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => { // Reducer to set user data in the state
            const { _id, name, email, phone, role } = action.payload;
            state._id = _id; 
            state.name = name; 
            state.email = email;
            state.phone = phone;
            state.role = role;
            state.isAuth = true; // Set isAuth to true when user data is set, indicating the user is authenticated
        },

        removeUser: (state) => { // Reducer to remove user data from the state (e.g., on logout)
            state._id = "";
            state.name = "";
            state.email = "";
            state.phone = "";
            state.role = "";
            state.isAuth = false; // Set isAuth to false when user data is removed, indicating the user is not authenticated
        }
    }
})

export const { setUser, removeUser } = userSlice.actions; // Exporting the action creators for setting and removing user data
export default userSlice.reducer; // Exporting the reducer to be used in the Redux store