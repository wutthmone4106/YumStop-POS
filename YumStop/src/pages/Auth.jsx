import React from 'react'
import restaurant from '../assets/images/SideBar/Fast Food 2.jpg' 
import logo from '../assets/images/logo.png'
import Register from '../components/auth/Register'
import Login from '../components/auth/Login'
import { useState } from 'react'

const Auth = () => {

  // State to toggle between Login and Register components
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Section */}
      <div className="w-1/2 relative flex items-center justify-center">

        <img 
          src={restaurant} 
          alt="Restaurant Background" 
          className="w-full h-full object-cover" 
        />

        {/* Black Overlay */}
        <div className="absolute inset-0 bg-black opacity-70"></div>

        {/*  Logo in the Center */}
        <div className="absolute flex flex-col items-center justify-center z-10 animate-fade-in">
          <h2 className="text-5xl font-black tracking-wider bg-gradient-to-r from-[#ffcc00] via-[#f6b100] to-[#e63946] bg-clip-text text-transparent mt-4 uppercase border-2 border-[#ffcc00] rounded-xl px-4 py-2">
            YumStop
          </h2>
        </div>

        {/* Quote at the bottom */}
        <blockquote className="absolute bottom-10 px-8 mb-10 text-white text-lg z-10">
          <span className="bg-gradient-to-r from-[#ffcc00] via-[#f6b100] to-[#ffcc00] bg-clip-text text-transparent text-2xl italic font-semibold">"Stop the craving. Start the Yum."</span> <br />
          <span className="text-white font-semibold">YumStop</span> : Where great tastes collide and swift service is our pride.
        </blockquote>
      </div>

      {/* Right Section */}
      <div className="w-1/2 min-h-screen bg-[#1a1a1a] p-10">
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="YumStop Logo" className="w-14 h-14 border-2 rounded-xl p-1" />
          <h1 className="text-lg  font-semibold text-[#f5f5f5] tracking-wide">YumStop</h1>
        </div>

        <h2 className="text-4xl text-center mt-10 font-semibold bg-gradient-to-r from-[#ffcc00] via-[#f6b100] to-[#e63946] bg-clip-text text-transparent mb-10">
          {isRegister ? "Employee Registration" : "Employee Login Portal"}
        </h2>

        {/* Components */}
        { isRegister ? <Register setIsRegister={setIsRegister} /> : <Login /> } {/* Conditionally render Register or Login component based on isRegister state */}

        <div className="flex justify-center mt-6">
          <p className="text-sm text-[#ababab]">
            { isRegister ? "Already have an account?" : "Don't have an account?" } <a onClick={() => setIsRegister(!isRegister)} href="#" className="text-[#ffcc00] hover:underline cursor-pointer">{ isRegister ? "Login" : "Sign Up" }</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth