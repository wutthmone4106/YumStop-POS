import React from 'react';
import { FaCheckDouble, FaCircle, FaRegClock } from 'react-icons/fa';
import { getAvatarName } from '../../utils'; 
import { getPerformanceMetrics } from "../../https/index.js"; 

const OrderList = ({ order }) => {
  const customerName = order?.customerDetails?.name || order?.customerName || "Walk-in Guest";
  const itemCount = order?.items?.length || order?.totalItems || 0;
  const tableDisplay = order?.orderType === "Take Away" ? "Take Away" : "Dine In";
  const status = order?.orderStatus || "Pending";

  const isReady = /ready/i.test(status) || /completed/i.test(status);

  const formatOrderedTime = (dateString) => {
    if (!dateString) return "Just Now";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const orderedTime = formatOrderedTime(order?.createdAt || order?.orderDate);

  return (
    <div className="flex items-center gap-5 mb-3 bg-[#1f1f1f] hover:bg-[#252525] transition-all duration-200 rounded-[12px] px-5 py-3.5 border border-neutral-900/20">
      
      {/* Left Icon Avatar */}
      <button className="bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946] w-12 h-12 font-bold text-md text-[#f5f5f5] rounded-lg flex items-center justify-center shrink-0 shadow-md">
        {getAvatarName?.(customerName) || "WC"}
      </button>
      
      {/* Main Content Layout Row */}
      <div className="flex items-center justify-between w-full">
        
        {/* Customer Names & Item Count */}
        <div className="flex flex-col items-start gap-1 w-1/4">
          <h1 className="text-[#f5f5f5] text-md font-semibold tracking-wide truncate max-w-[140px]">
            {customerName}
          </h1>
          <p className="text-[#ababab] text-xs">
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </p>
        </div>

        {/* Ordered Time Stamp Column */}
        <div className="flex items-center gap-2 text-[#ababab] text-xs w-1/4 justify-center">
          <FaRegClock className="text-[#f6b100]/80" size={13} />
          <span className="font-medium">{orderedTime}</span>
        </div>
        
        {/* TakeAway / Dine-In Badge */}
        <div className="w-1/4 flex justify-center">
          <h1 className="text-[#f6b100] text-xs font-bold border border-[#f6b100]/40 bg-[#f6b100]/5 rounded-lg px-3 py-1.5 whitespace-nowrap tracking-wide">
            {tableDisplay}
          </h1>
        </div>
        
        {/* Status Indicators neatly right-aligned */}
        <div className="flex flex-col items-end gap-1 w-1/4 min-w-[110px]">
          <p className={`${isReady ? "text-emerald-500" : "text-[#f6b100]"} text-xs flex items-center gap-1.5 font-semibold`}>
            <FaCheckDouble size={12} /> {status}
          </p>
          <p className="text-[#ababab] text-[11px] flex items-center gap-1.5">
            <FaCircle size={7} className={isReady ? "text-emerald-500" : "text-[#f6b100]"} />
            {isReady ? "Ready to serve" : "Preparing item"}
          </p>
        </div>

      </div>
    </div>
  );
};

export default OrderList;