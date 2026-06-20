import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPerformanceMetrics } from "../https/index.js"; // Your pre-configured instance
import BottomNav from '../components/shared/BottomNav';
import Greetings from '../components/home/Greetings';
import MiniCard from '../components/home/MiniCard';
import { BsCashCoin } from 'react-icons/bs';
import { GrInProgress } from 'react-icons/gr';
import RecentOrders from '../components/home/RecentOrders';
import PopularDishes from '../components/home/PopularDishes';

const Home = () => {
  const { data: staffMetrics, isLoading, error } = useQuery({
    queryKey: ['staffPerformance'],
    queryFn: async () => {
      try {
        const response = await getPerformanceMetrics();
        // response.data is the actual JSON payload from the backend express server
        if (response.data && response.data.success) {
          return response.data.data; // Directly return the inner dashboard data object
        }
        return null;
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        throw err;
      }
    },
    refetchInterval: 5000 // Automatically refreshes every 5 seconds
  });

  // Fallback to defaults cleanly if data is loading or missing
  const totalEarnings = staffMetrics?.sales || "0";
  const targetProgress = staffMetrics?.targetProgress || 0;
  const activeCount = staffMetrics?.activeOrdersCount || 0;
  const recentOrders = staffMetrics?.recentOrders || [];
  const popularDishesList = staffMetrics?.popularDishesList || [];

  return (
    <section className="bg-[#1f1f1f] h-[calc(100vh-5rem)] overflow-hidden flex gap-3">
      {/* Left Columns Container */}
      <div className="flex-[3]">
        <Greetings />

        <div className="flex items-center w-full gap-3 px-8 mt-8">
          {/* Card 1: Total Earnings */}
          <MiniCard 
            title="Total Earnings" 
            icon={<BsCashCoin />} 
            number={isLoading ? "..." : totalEarnings} 
            footerNum={targetProgress} 
            isPercentageTarget={true} 
          />
          {/* Card 2: In Progress */}
          <MiniCard 
            title="In Progress" 
            icon={<GrInProgress />} 
            number={isLoading ? "..." : activeCount} 
            footerNum={0} 
            isPercentageTarget={false} 
          />
        </div>

        {error ? (
          <div className="text-red-500 text-center mt-10 text-sm">
            Failed to load data. Please check your server connection or login session.
          </div>
        ) : (
          <RecentOrders orders={recentOrders} isLoading={isLoading} />
        )}
      </div>

      {/* Right Column Container */}
      <div className="flex-[2]">
        <PopularDishes dishes={popularDishesList} />
      </div>
      <BottomNav />
    </section>
  );
};

export default Home;
