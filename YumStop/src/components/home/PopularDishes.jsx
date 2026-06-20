import React from "react";
import { useNavigate } from "react-router-dom";

const PopularDishes = ({ dishes = [] }) => {
  const navigate = useNavigate();

  // Safely grab the backend URL context
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  return (
    <div className="mt-6 pr-6">
      <div className="bg-[#1a1a1a] w-full rounded-lg flex flex-col h-[740px]">
        
        {/* Header Block Row */}
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">Popular Dishes</h1>
          <button 
            onClick={() => navigate('/menu')} 
            className="text-[#025cca] text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer outline-none"
          >
            View All
          </button>
        </div>

        {/* Dynamic List Container */}
        <div className="overflow-y-auto pb-4 flex-grow scrollbar-hide">
          {dishes.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center mt-12">No orders placed yet.</p>
          ) : (
            dishes.map((dish) => {
              // Standardize image loading string properties
              let finalImageUrl = "https://placehold.co/50?text=Food";

              if (dish.image) {
                const cleanSrc = dish.image.replace(/\\/g, "/");
                if (cleanSrc.startsWith("http://") || cleanSrc.startsWith("https://")) {
                  finalImageUrl = cleanSrc;
                } else {
                  const cleanPath = cleanSrc.startsWith("/") ? cleanSrc : `/${cleanSrc}`;
                  finalImageUrl = `${BACKEND_URL}${cleanPath}`;
                }
              }

              return (
                <div key={dish.id} className="flex items-center bg-[#1f1f1f] rounded-[15px] px-6 py-4 mt-3 mx-6 border border-neutral-900/10">
                  <div className="flex items-center justify-between w-full">
                    
                    {/* Left Column Section: Number + Image + Name */}
                    <div className="flex items-center gap-4 w-[75%]">
                      {/* Serial Rank Number Row */}
                      <h1 className="text-[#f5f5f5] font-bold text-md w-6 shrink-0">
                        {dish.id < 10 ? `0${dish.id}` : dish.id}
                      </h1>
                      
                      {/* Dish Image */}
                      <img 
                        src={finalImageUrl} 
                        alt={dish.name} 
                        className="w-[50px] h-[50px] object-cover rounded-lg shrink-0 bg-neutral-800" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://placehold.co/50?text=Food";
                        }}
                      />

                      {/* Display Item Name */}
                      <h2 className="text-[#f5f5f5] text-sm font-semibold truncate pr-2">
                        {dish.name}
                      </h2>
                    </div>
                    
                    {/* Right Column Section: Quantities Sold Counters */}
                    <div className="w-[25%] flex justify-end">
                      <p className="text-[#f5f5f5] text-xs font-semibold bg-[#1a1a1a] px-3 py-1.5 rounded-md border border-neutral-800/60 whitespace-nowrap">
                        <span className="text-[#ababab] mr-1">Sold:</span>
                        {dish.numberOfOrders}
                      </p>
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>
        
      </div>
    </div>
  );
};

export default PopularDishes;
