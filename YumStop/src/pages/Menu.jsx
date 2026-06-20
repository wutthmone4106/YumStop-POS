import React from 'react'
import BottomNav from '../components/shared/BottomNav'
import BackButton from '../components/shared/BackButton.jsx'
import { IoFastFoodOutline } from "react-icons/io5";
import MenuContainer from '../components/menu/MenuContainer.jsx';
import CustomerInfo from '../components/menu/CustomerInfo.jsx';
import CardInfo from '../components/menu/CardInfo.jsx';
import BillInfo from '../components/menu/BillInfo.jsx';
import { useSelector } from 'react-redux';

const Menu = () => {
  const customerData = useSelector( state => state.customer);

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
        {/* Left Div */}
        <div className="flex-[3]">
            <div className="flex items-center justify-between px-10 py-4 mt-2">
                <div className="flex items-center gap-4">
                  <BackButton />
                  <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">Menu</h1>
                </div>
                <div className="flex items-center justify-around gap-4">
                  <div className="flex items-center gap-3 cursor-pointer">
                    <IoFastFoodOutline className="text-[#f5f5f5] text-4xl" />
                    <div className="flex flex-col items-start">
                      {/* If it's Take Away, display "Take Away", otherwise use the customer name */}
                      <h1 className="text-md text-[#f5f5f5] font-semibold">
                          {customerData.orderType === "Take Away" || (customerData.customerName && customerData.customerName.startsWith("Order #"))
                              ? "Take Away"
                              : (customerData.customerName || "Customer Name")}
                      </h1>
                      
                      <p className="text-xs text-[#ababab] font-medium">
                          {customerData.orderType === "Take Away" || (customerData.customerName && customerData.customerName.startsWith("Order #"))
                              ? `Order #${localStorage.getItem('yumstop_daily_sequence') || '1'}`
                              : `${customerData.tableNo || "N/A"}`}
                      </p>
                    </div>
                  </div>
                </div>
            </div>
            <MenuContainer />
        </div>

        {/* Right Div */}
        <div className="flex-[1] bg-[#1a1a1a] mt-4 mr-3 h-[780px] rounded-lg pt-2">
            {/* Customer Info */}
            <CustomerInfo />
            <hr className="border-[#2a2a2a] border-t-2" />
            {/* Cart Items */}
            <CardInfo />
            <hr className="border-[#2a2a2a] border-t-2" />
            {/* Bills */}
            <BillInfo />
        </div>
      
      <BottomNav />
    </section>
  )
}

export default Menu