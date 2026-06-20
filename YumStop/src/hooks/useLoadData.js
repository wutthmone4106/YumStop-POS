import { useEffect, useState } from 'react';
import { getUserData } from '../https';
import { useDispatch } from 'react-redux';
import { setUser, removeUser } from '../redux/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const useLoadData = () => {

    const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    const location = useLocation(); // Hook to access the current location (URL path)

    const [isLoading, setIsLoading] = useState(true); // State to manage loading status

    useEffect(() => { // This will run once when the app starts
        const fetchUser = async () => {
            if (location.pathname === '/auth') {
                return;
            }

            try {

                const {data} = await getUserData(); // Assuming this returns user data and possibly other necessary info for the app
                console.log(data);
                const { _id, name, email,phone, role } = data.data; // Extracting user details from the response
                dispatch(setUser({ _id, name, email, phone, role })); // Dispatching an action to set the user in the Redux store
                
            } catch (error) {
                dispatch(removeUser()); // Clear user data if fetching fails (e.g., token is invalid)
                navigate("/auth"); // Redirect to login page if fetching user data fails
                console.log(error);
            } finally {
                setIsLoading(false); // Set loading to false after the fetch attempt is complete, regardless of success or failure
            }
        }

        fetchUser(); // Call the async function to fetch user data on app start
    }, [dispatch, navigate, location.pathname]); // Dependencies for useEffect

    return isLoading; // Return the loading state so components can conditionally render based on it
}

export default useLoadData;