import React from 'react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { login } from '../../https/index.js';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store

    const navigate = useNavigate(); // Hook to programmatically navigate to different routes

    // State to hold form data
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    // Generic change handler for form inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    // Submit handler (currently just prevents default form submission)
    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData); // Trigger the login mutation with the form data
        console.log("Form Data Submitted:", formData);
    }

    // Using React Query's useMutation to handle the login process
    const loginMutation = useMutation({
        mutationFn: (reqData) => login(reqData), // Function to perform the login API call
        onSuccess: (res) => { // Callback for successful login
            const { data } = res;
            console.log("Login successful:", data);
            const { _id, name, email, phone, role } = data.data; // Extracting user details from the response
            
            // Dispatching an action to set the user in the Redux store
            dispatch(setUser({ _id, name, email, phone, role })); 

            if (role === 'Admin') {
                navigate("/dashboard");
            } else {
                navigate("/");
            }
        },
        onError: (error) => {
            console.log(error);

            enqueueSnackbar(
                error?.response?.data?.message || "Login failed!",
                { variant: "error" }
            );
        }
    });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Employee Email</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                <input type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Employee Email"
                    className="bg-transparent flex-1 text-white focus:outline-none" required />
            </div>
        </div>

        <div>
            <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Password</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                <input type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter Password"
                    className="bg-transparent flex-1 text-white focus:outline-none" required />
            </div>
        </div>

        <button type="submit" className="w-full mt-6 py-3 text-lg bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#f72536] text-[#f5f5f5] rounded-lg hover:shadow-[0_0_30px_rgba(230,57,70,0.8)] transition-shadow duration-300">
            Login
        </button>
      </form>
    </div>
  )
}

export default Login
