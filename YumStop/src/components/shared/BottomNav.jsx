import React from 'react'
import { FaHome } from 'react-icons/fa'
import { MdOutlineReorder, MdTableBar, MdOutlineDeliveryDining } from 'react-icons/md'
import { CiCircleMore } from 'react-icons/ci'
import { BiSolidDish } from 'react-icons/bi'
import { IoFastFoodOutline } from 'react-icons/io5'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Modal from './Modal'
import { useDispatch } from 'react-redux' 
import { setCustomer } from '../../redux/slices/customerSlice';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("Dine In");

  const openModal = () => {
    setIsModalOpen(true);
    setOrderType("Dine In");
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPhone("");
    setGuestCount(1);
  };

  const increment = () => {
    if (guestCount >= 6) return;
    setGuestCount(prev => prev + 1);
  } 
  const decrement = () => setGuestCount(prev => (prev > 1 ? prev - 1 : 1));

  const isActive = (path) => location.pathname === path;

  // Dynamically calculates and saves sequential numbers using localStorage
  const handleTakeAwayInstant = () => {
    // Get the last used takeaway number from local storage (or default to 0 if it's the first order)
    const currentCount = parseInt(localStorage.getItem('takeaway_order_counter') || '0', 10);
    
    // Increment it sequentially by 1
    const nextCount = currentCount + 1;
    
    // Save the updated position so the next click becomes Order #2, Order #3, etc.
    localStorage.setItem('takeaway_order_counter', nextCount.toString());
    
    // Construct the dynamic text reference string
    const dynamicTakeAwayRef = `Order #${nextCount}`;
    
    dispatch(setCustomer({ 
      name: dynamicTakeAwayRef, 
      phone: "N/A", 
      guests: 0,
      orderType: "Take Away" 
    }));
    
    closeModal();
    navigate("/menu");
  };

  const handleCreateDineInOrder = () => {
    if (!name.trim() || !phone.trim()) return alert("Please fill out all fields for Dine In tracking");
    
    dispatch(setCustomer({ 
      name: name.trim(), 
      phone: phone.trim(), 
      guests: guestCount,
      orderType: "Dine In" 
    }));
    
    closeModal();
    navigate("/tables");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#262626] p-2 h-16 flex justify-around z-40">
      <button onClick={() => navigate("/")} className={`flex items-center justify-center font-bold ${isActive("/") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"}  w-[200px] rounded-[20px]`}><FaHome className="inline mr-2" size={20} /><p>Home</p></button>
      <button onClick={() => navigate("/orders")} className={`flex items-center justify-center font-bold ${isActive("/orders") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"}  w-[200px] rounded-[20px]`}><MdOutlineReorder className="inline mr-2" size={20} /><p>Orders</p></button>
      <button onClick={() => navigate("/tables")} className={`flex items-center justify-center font-bold ${isActive("/tables") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"}  w-[200px] rounded-[20px]`}><MdTableBar className="inline mr-2" size={20} /><p>Tables</p></button>
      <button onClick={() => navigate("/more")} className={`flex items-center justify-center font-bold ${isActive("/more") ? "text-[#f5f5f5] bg-[#343434]" : "text-[#ababab]"}  w-[200px] rounded-[20px]`}><CiCircleMore className="inline mr-2" size={20} /><p>More</p></button>

      <button disabled={isActive("/tables") || isActive("/menu")} onClick={openModal} className="absolute bottom-6 h-14 w-14 flex items-center justify-center bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946] text-[#f5f5f5] rounded-full shadow-[0_0_20px_rgba(246,177,0,0.6)] hover:shadow-[0_0_30px_rgba(230,57,70,0.8)] transition-shadow duration-300">
        <BiSolidDish size={28} />
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Create New Order">
        <div className="grid grid-cols-2 gap-3 mb-6 bg-[#1f1f1f] p-1 rounded-xl">
          <button 
            type="button"
            onClick={() => setOrderType("Dine In")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${orderType === "Dine In" ? "bg-amber-600 text-white shadow" : "text-[#ababab] hover:text-white"}`}
          >
            <IoFastFoodOutline size={16} /> Dine In
          </button>
          <button 
            type="button"
            onClick={() => setOrderType("Take Away")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${orderType === "Take Away" ? "bg-emerald-600 text-white shadow" : "text-[#ababab] hover:text-white"}`}
          >
            <MdOutlineDeliveryDining size={18} /> Take Away
          </button>
        </div>

        {orderType === "Take Away" ? (
          <div className="text-center py-4 space-y-4 animate-fadeIn">
            <p className="text-[#ababab] text-sm leading-relaxed">
              Bypass customer details and seating arrangements to create an immediate take away order layout.
            </p>
            <button 
              onClick={handleTakeAwayInstant} 
              className="w-full bg-gradient-to-b from-emerald-500 to-teal-600 text-white font-bold rounded-full py-3 mt-4 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300"
            >
              Open Menu Directly
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-[#ababab] mb-2 text-sm font-medium">Customer Name</label>
              <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Enter customer name" className="bg-transparent flex-1 text-white focus:outline-none" />
              </div>
            </div>
            
            <div>
              <label className="block text-[#ababab] mb-2 text-sm font-medium">Customer Phone</label>
              <div className="flex items-center rounded-lg p-3 px-4 bg-[#1f1f1f]">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} type="text" placeholder="Enter customer phone" className="bg-transparent flex-1 text-white focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-[#ababab]">Guests</label>
              <div className="flex items-center justify-between bg-[#1f1f1f] px-4 py-3 rounded-lg">
                <button onClick={decrement} className="text-yellow-500 text-2xl font-bold">&minus;</button>
                <span className="text-white font-medium">{guestCount} Person</span>
                <button onClick={increment} className="text-yellow-500 text-2xl font-bold">&#43;</button>
              </div>
            </div>

            <button 
              onClick={handleCreateDineInOrder} 
              className="w-full bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946] text-[#f5f5f5] font-bold rounded-full py-3 mt-6 shadow-[0_0_20px_rgba(246,177,0,0.4)] transition-all duration-300"
            >
              Select Table Seating
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BottomNav;
