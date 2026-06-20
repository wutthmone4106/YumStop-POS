import React from 'react'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { register } from '../../https/index.js';
import { enqueueSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const Register = ({setIsRegister}) => { // Destructuring setIsRegister from props to toggle between Register and Login components

    // State to hold form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: ""
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
        registerMutation.mutate(formData); // Trigger the register mutation with the form data
        console.log("Form Data Submitted:", formData);
    }

    // Function to handle role selection 
    const handleRoleSelection = (selectedRole) => {
        setFormData({
            ...formData,
            role: selectedRole
        });
    }

    // Using React Query's useMutation to handle the login process
        const registerMutation = useMutation({
            mutationFn: (reqData) => register(reqData), // Function to perform the register API call
            onSuccess: (res) => { // Callback for successful registration
                const { data } = res; 
                console.log("Registration successful:", data);
                enqueueSnackbar("Registration successful!", { variant: 'success'});
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",
                    role: ""
                });

                setTimeout(() => {
                    setIsRegister(false); // Switch to Login component after successful registration
                },1500);
            },
            onError: (error) => { // Callback for login failure
                const { response } = error; // Extracting the response from the error object
                enqueueSnackbar(response.data.message, { variant: 'error'});
            }
        });

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            <label className="block text-[#ababab] mb-2 text-sm font-medium">Employee Name</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                <input type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Employee Name"
                    className="bg-transparent flex-1 text-white focus:outline-none required" />
            </div>
        </div>

        <div>
            <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Employee Email</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                <input type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter Employee Email"
                    className="bg-transparent flex-1 text-white focus:outline-none required" />
            </div>
        </div>

        <div>
            <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Employee Phone</label>
            <div className="flex items-center rounded-lg p-5 px-4 bg-[#1f1f1f]">
                <input type="number"
                    name="phone"
                    placeholder="Enter Employee Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="bg-transparent flex-1 text-white focus:outline-none required" />
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
                    className="bg-transparent flex-1 text-white focus:outline-none required" />
            </div>
        </div>

        <div>
            <label className="block text-[#ababab] mb-2 mt-4 text-sm font-medium">Choose Your Role</label>

            <div className="flex items-center gap-3 mt-4">
                {["Waiter", "Cashier", "Admin"].map((role) => (
                    <button key={role} type="button" onClick={() => handleRoleSelection(role)} className={`bg-[#1f1f1f] px-4 py-3 w-full rounded-lg text-[#ababab] font-medium hover:bg-[#2e2e2e] transition-colors duration-300 ${formData.role === role ? "bg-[#464646] text-white" : ""}`}>
                        {role}
                    </button>
                ))}
            </div>
        </div>

        <button type="submit" className="w-full mt-6 py-3 text-lg bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#f72536] text-[#f5f5f5] rounded-lg hover:shadow-[0_0_30px_rgba(230,57,70,0.8)] transition-shadow duration-300">
            Sign Up
        </button>
      </form>
    </div>
  )
}

export default Register
