import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getOrders } from '../https';
import BottomNav from "../components/shared/BottomNav.jsx";
import OrderCard from '../components/orders/OrderCard.jsx';
import BackButton from '../components/shared/BackButton.jsx';
import { HiOutlineInbox } from 'react-icons/hi';

const Orders = () => {
  const [status, setStatus] = useState("all");
  const [searchParams] = useSearchParams();
  
  // Captures the optional "?id=..." parameter when clicked from a TableCard
  const targetTableId = searchParams.get('id');

  const searchKeyword = useSelector((state) => state.search?.query || '').toLowerCase();

  // Fetch real orders from the database every 5 seconds
  const { data, isLoading, isError } = useQuery({
    queryKey: ['service-orders'],
    queryFn: getOrders,
    refetchInterval: 5000 
  });

  if (isLoading) return <p className="text-white p-10 text-sm">Loading order registry logs...</p>;
  if (isError) return <p className="text-red-400 p-10 text-sm">Error connecting to order server.</p>;

  // Extract array safely from backend API layout envelope
  const allOrders = data?.data?.data || [];

  // Filter rules
  const filteredOrders = allOrders.filter((order) => {
    // Sync table bindings if routing from TableCard overview layout
    if (targetTableId) {
      return order.table === targetTableId || order.table?._id === targetTableId;
    }

    // Match the current active pill tab
    const matchesTab = status === "all" || 
      (status === "progress" && order.orderStatus?.toLowerCase() === "progress") ||
      (status === "ready" && order.orderStatus?.toLowerCase() === "ready") ||
      (status === "completed" && order.orderStatus?.toLowerCase() === "completed");

    // Match text query against Name, Phone number, or linked Table Designation
    const matchesSearch = !searchKeyword || 
      order.customerDetails?.name?.toLowerCase().includes(searchKeyword) ||
      order.customerDetails?.phone?.includes(searchKeyword) ||
      order.table?.tableNumber?.toLowerCase().includes(searchKeyword);

    return matchesTab && matchesSearch;
  });
  
  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden">
      {/* HEADERBAR */}
      <div className="flex items-center justify-between px-10 py-4 mt-2">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-[#f5f5f5] text-2xl font-bold tracking-wide">
            {targetTableId ? "Table Order Focus" : "Orders Dashboard"}
          </h1>
        </div>
        
        {/* FILTERS */}
        <div className="flex items-center justify-around gap-4">
          {["all", "progress", "ready", "completed"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setStatus(tab)} 
              className={`text-[#ababab] text-sm capitalize rounded-xl px-5 py-2.5 font-semibold transition-all ${
                status === tab ? "bg-[#383838] text-white shadow-md" : "hover:text-neutral-200"
              }`}
            >
              {tab === "progress" ? "In Progress" : tab}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS GRID DISPLAY WITH LAYOUT FIXES */}
      <div className="flex flex-wrap items-start content-start gap-6 px-16 py-4 overflow-y-scroll h-[calc(100vh-10rem)] scrollbar-hide pb-24">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        ) : (
          <div className="w-full h-64 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 bg-[#262626] rounded-full border border-neutral-800 flex items-center justify-center text-neutral-500 mb-3">
              <HiOutlineInbox className="text-2xl" />
            </div>
            <h2 className="text-neutral-400 font-bold text-md">No Orders Found</h2>
            <p className="text-neutral-600 text-xs mt-0.5">There are no records matching this category selection loop.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default Orders;
