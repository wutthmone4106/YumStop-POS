import React from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { getPerformanceMetrics } from '../https';
import BottomNav from '../components/shared/BottomNav';

import WorkspaceHeader from '../components/more/WorkspaceHeader';
import CashierWorkspace from '../components/more/CashierWorkspace';
import AdminLeaderboard from '../components/more/AdminLeaderboard';

const More = () => {
  const user = useSelector((state) => state.user || { name: "Staff Member", role: "waiter" });
  const isAdmin = user.role?.toLowerCase() === 'admin';

  const { data: responsePayload, isLoading, isError } = useQuery({
    queryKey: ['staff-performance', user.role],
    queryFn: getPerformanceMetrics,
    refetchInterval: 5000 
  });

  if (isLoading) return <p className="text-white p-10 text-sm">Loading performance statistics...</p>;
  if (isError) return <p className="text-red-400 p-10 text-sm">Error connecting to server.</p>;

  // Extract payload accurately depending on profile permission layer
  const performanceData = responsePayload?.data?.data || (isAdmin ? [] : {});

  return (
    <section className="bg-[#1f1f1f] min-h-screen text-white flex flex-col justify-between relative select-none">
      
      <WorkspaceHeader isAdmin={isAdmin} user={user} />

      <div className="flex-1 overflow-y-auto px-16 pt-6 pb-32
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-neutral-950/20
        [&::-webkit-scrollbar-track]:rounded-xl
        [&::-webkit-scrollbar-thumb]:bg-neutral-800
        [&::-webkit-scrollbar-thumb]:rounded-full"
      >
        {!isAdmin ? (
          // For cashiers, performanceData will be passed as a single clean metrics object
          <CashierWorkspace user={user} performanceData={performanceData} />
        ) : (
          // For admins, it remains an iterative dashboard performance array roster
          <AdminLeaderboard performanceData={performanceData} />
        )}
      </div>

      <BottomNav />
    </section>
  );
};

export default More;
