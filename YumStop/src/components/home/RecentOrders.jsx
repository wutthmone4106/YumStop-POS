import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import OrderList from './OrderList';

const RecentOrders = ({ orders = [], isLoading }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the orders list dynamically based on the search query
  const filteredOrders = orders.filter((order) => {
    const customerName = (order?.customerDetails?.name || order?.customerName || "Walk-in Guest").toLowerCase();
    const orderStatus = (order?.orderStatus || "Pending").toLowerCase();
    const query = searchQuery.toLowerCase();

    // Return true if the query matches either the customer name or the status
    return customerName.includes(query) || orderStatus.includes(query);
  });

  return (
    <div className="px-8 mt-6">
      <div className="bg-[#1a1a1a] w-full h-[450px] rounded-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <h1 className="text-[#f5f5f5] text-lg font-semibold tracking-wide">Recent Orders</h1>
          <button 
            onClick={() => navigate('/orders')} 
            className="text-[#025cca] text-sm font-semibold hover:underline bg-transparent border-none cursor-pointer outline-none"
          >
            View All
          </button>
        </div>

        {/* Search Input Container */}
        <div className="flex items-center gap-4 bg-[#1f1f1f] rounded-[20px] px-6 py-4 mx-6 border border-neutral-800/50 focus-within:border-neutral-700">
          <FaSearch className="text-[#ababab]" />
          <input
            type="text"
            placeholder="Search Recent Order..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#1f1f1f] text-[#f5f5f5] outline-none w-full text-sm"
          />
        </div>

        <div className="mt-4 px-6 overflow-y-scroll h-[300px] scrollbar-hide">
          {isLoading ? (
            <p className="text-neutral-500 text-sm text-center mt-10">Loading active recent orders...</p>
          ) : filteredOrders.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center mt-10">No matching orders found.</p>
          ) : (
            // 3. Render only the filtered list
            filteredOrders.map((order, idx) => (
              <OrderList key={order._id || idx} order={order} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrders;
