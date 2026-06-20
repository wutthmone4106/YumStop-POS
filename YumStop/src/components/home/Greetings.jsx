import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";

const Greetings = () => {

    const userData = useSelector((state) => state.user); // Accessing user data from the Redux store

    // State to hold the current date and time
    const[dateTime, setDateTime] = useState(new Date());

    // Using useEffect to set up an interval that updates the dateTime state every second
    useEffect(() => {
        const timer = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Function to format the date in a readable format 
    const formatDate = (date) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')}, ${date.getFullYear()}`;
    };

    // Function to format the time in HH:MM:SS format
    const formatTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    // Dynamic greeting based on the current hour of the day
    const getGreeting = () => {
      const hrs = dateTime.getHours();
      if (hrs < 12) return "Good Morning";
      if (hrs < 18) return "Good Afternoon";
      return "Good Evening";
    };

  return (
    <div className="flex justify-between items-center px-8 mt-5">
      <div>
        <h1 className="text-[#f5f5f5] text-2xl font-semibold tracking-wide">{getGreeting()}, { userData.name || "N/A" }!</h1>
        <p className="text-[#ababab] text-sm">Give Your Best Services For Customers😋🍔</p>
      </div>
      <div>
        <h1 className="text-[#f5f5f5] text-3xl font-bold tracking-wide w-[130px]">{formatTime(dateTime)}</h1>
        <p className="text-[#ababab] text-sm">{formatDate(dateTime)}</p>
      </div>
    </div>
  )
}

export default Greetings
