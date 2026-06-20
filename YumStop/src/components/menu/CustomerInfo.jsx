import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatDate, getAvatarName } from '../../utils';

const CustomerInfo = () => {
  const [dateTime, setDateTime] = useState(new Date());
  
  // Grab saved customer storage from Redux
  const customerData = useSelector(state => state.customer);
  
  const rawName = customerData.name || customerData.customerName || "";
  const isTakeAway = customerData.orderType === "Take Away" || rawName.startsWith("Order #");

  const displayCustomerName = isTakeAway 
    ? "Take Away Customer" 
    : (rawName || "Customer Name");

  // Dynamic Daily Sequence Reset Logic
  const getDailyFallbackNumber = () => {
    const todayStr = new Date().toLocaleDateString(); 
    const savedDate = localStorage.getItem('yumstop_order_date');
    let currentSequence = localStorage.getItem('yumstop_daily_sequence');

    // If the day changed, reset the sequence back to 1
    if (savedDate !== todayStr) {
      localStorage.setItem('yumstop_order_date', todayStr);
      localStorage.setItem('yumstop_daily_sequence', '1');
      currentSequence = '1';
    }

    return currentSequence || '1';
  };

  // Determine the final display order number
  let displayOrderNumber = `Order #${getDailyFallbackNumber()}`;

  // If Redux explicitly has a specific daily number for this exact active order, use it.
  if (customerData.dailyOrderNumber) {
    displayOrderNumber = `Order #${customerData.dailyOrderNumber}`;
  } 

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex flex-col items-start">
        <h1 className="text-md text-[#f5f5f5] font-semibold tracking-wide">
          {displayCustomerName}
        </h1>
        <p className="text-xs text-[#ababab] font-medium mt-1">
          {displayOrderNumber} • {isTakeAway ? "Take Away" : "Dine In"}
        </p>
        <p className="text-xs text-[#ababab] font-medium mt-2">
          {formatDate(dateTime)}
        </p>
      </div>
      <button className="bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946] text-[#f5f5f5] p-3 text-xl font-bold rounded-lg uppercase">
        {getAvatarName(displayCustomerName) || "TAC"}
      </button>
    </div>
  );
};

export default CustomerInfo;
