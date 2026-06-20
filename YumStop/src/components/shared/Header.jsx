import React, { useEffect, useState } from 'react'; 
import logo from '../../assets/images/logo.png';
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa';
import { useSelector, useDispatch } from "react-redux";
import { TbLogout } from "react-icons/tb";
import { useMutation } from '@tanstack/react-query';
import { logout } from '../../https/index.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeUser } from '../../redux/slices/userSlice.js';
import { MdDashboard } from 'react-icons/md';
import { setSearchQuery, clearSearchQuery } from '../../redux/slices/searchSlice.js';
import EmployeeIdModal from './EmployeeIdModal.jsx'; 

const Header = () => {
  const userData = useSelector((state) => state.user); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const searchQuery = useSelector((state) => state.search?.query || '');
  const location = useLocation();

  const [showIdCard, setShowIdCard] = useState(false);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearSearchQuery());
  }, [location.pathname, dispatch]);

  const logoutMutation = useMutation({
    mutationFn: () => logout(), 
    onSuccess: (res) => { 
        console.log(res);
        dispatch(removeUser()); 
        navigate("/auth"); 
    },
    onError: (error) => { 
        console.log(error); 
    }
  });

  const handleLogout = (e) => {
    e.stopPropagation(); // Stops modal card wrapper trigger when tapping logout action
    logoutMutation.mutate(); 
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-[#1a1a1a] text-white relative">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img onClick={() => navigate("/")} src={logo} className="h-8 w-8 cursor-pointer" alt="YumStop Logo" />
        <h1 onClick={() => navigate("/")} className="text-lg font-semibold text-[#f5f5f5] cursor-pointer">YumStop POS</h1>
      </div>

      {/* Dynamic Search Bar Component Area */}
      <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[20px] px-5 py-2 w-[500px] border border-neutral-800/20 focus-within:border-neutral-700/60 transition-all">
        <FaSearch className="text-[#f5f5f5]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))} 
          placeholder="Search..."
          className="bg-[#1f1f1f] text-[#f5f5f5] outline-none w-full"
        />
      </div>

      {/* Logged User Controls */}
      <div className="flex items-center gap-4">
        {
          userData?.role?.toLowerCase() === "admin" && (
            <div 
              onClick={() => navigate("/dashboard")} 
              className="flex items-center gap-1 cursor-pointer bg-[#1f1f1f] hover:bg-[#2a2a2a] rounded-[15px] p-3 transition-colors duration-200 select-none"
            >
              <MdDashboard className="text-[#f5f5f5] text-2xl" />
            </div>
          )
        }
        
        <div className="bg-[#1f1f1f] rounded-[15px] p-3 cursor-pointer">
            <FaBell className="text-[#f5f5f5] text-2xl" />
        </div>

        {/* Profile Details Container Trigger Click */}
        <div 
          onClick={() => setShowIdCard(true)}
          className="flex items-center gap-3 cursor-pointer hover:bg-[#222] p-2 rounded-xl transition-all duration-150 select-none"
          title="View Employee Digital Badge"
        >
            <FaUserCircle className="text-[#f5f5f5] text-4xl" />
            <div className="flex flex-col items-start">
                <h1 className="text-md text-[#f5f5f5] font-semibold">{ userData.name || "N/A" }</h1>
                <p className="text-xs text-[#ababab] font-medium">{ userData.role || "Role" }</p>
            </div>
            <TbLogout onClick={handleLogout} className="text-[#f5f5f5] ml-2 hover:text-red-400 transition-colors" size={35} />
        </div>
      </div>

      {/* Isolated Split Modal Interface Core */}
      <EmployeeIdModal 
        isOpen={showIdCard} 
        onClose={() => setShowIdCard(false)} 
        userData={userData} 
      />
    </header>
  );
};

export default Header;
