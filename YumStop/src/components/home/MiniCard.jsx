import React from 'react';
import { getPerformanceMetrics } from "../../https/index.js";

const MiniCard = ({ title, icon, number, footerNum, isPercentageTarget }) => {
  return (
    <div className="bg-[#1a1a1a] py-5 px-5 rounded-lg w-[50%]">
      <div className="flex items-center justify-between">
        <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">{title}</h1>
        <button className={`${title === "Total Earnings" ? "bg-gradient-to-br from-[#ccff00] via-[#02ca3a] to-[#015e1c]" : "bg-gradient-to-b from-[#ffcc00] via-[#f6b100] to-[#e63946]"} p-3 rounded-lg text-[#f5f5f5] text-2xl`}>
          {icon}
        </button>
      </div>
      <div>
        <h1 className="text-[#f5f5f5] text-4xl font-bold mt-5">
          {title === "Total Earnings" && !String(number).includes("MMK") ? `${number} MMK` : number}
        </h1>
        <h1 className="text-[#ababab] text-sm mt-2">
          {isPercentageTarget ? (
            <>
              <span className="text-[#02ca3a] font-semibold">{footerNum}%</span> daily goal achieved
            </>
          ) : (
            <span className="text-[#ababab]">Current active counter</span>
          )}
        </h1>
      </div>
    </div>
  );
};

export default MiniCard;
